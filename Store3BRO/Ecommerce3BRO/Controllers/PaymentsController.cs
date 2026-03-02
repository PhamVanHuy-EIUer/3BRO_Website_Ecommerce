using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Helper.Enums;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : Controller
    {
        private readonly IMomoService _momoService;
        private readonly IOrderRepository _orderRepository;
        private readonly Ecommerce3BROContext _context;
        private readonly IPaymentRepository _paymentService;
        private readonly IOrderRepository _orderService;
        private readonly IShipmentRepository _shipmentService;

        public PaymentsController(IMomoService momoService, IOrderRepository orderRepository, Ecommerce3BROContext context, IPaymentRepository paymentService, IOrderRepository orderService, IShipmentRepository shipmentService)
        {
            _momoService = momoService;
            _orderRepository = orderRepository;
            _context = context;
            _paymentService = paymentService;
            _orderService = orderService;
            _shipmentService = shipmentService;
        }

        // User bấm "Thanh toán MoMo"
        [Authorize]
        [HttpPost("momo")]
        public async Task<IActionResult> PayWithMomo(MomoCheckoutRequest request)
        {
            var order = await _context.Order
           .Include(o => o.User)
           .Include(o => o.OrderDetails).ThenInclude(od => od.Product)
           .Include(o => o.OrderDetails).ThenInclude(od => od.Refunds)
           .Include(o => o.OrderDiscounts).ThenInclude(od => od.Discount).FirstOrDefaultAsync(o=>o.Id==request.OrderId);
            var findPayment = await _context.Payment.FirstOrDefaultAsync(p => p.OrderId == order.Id);
            //if (findPayment.PayUrl!=null&&findPayment.ExpiredUrlTime>DateTime.UtcNow)
            //{
            //    return Ok(new
            //    {
            //        payUrl = findPayment.PayUrl
            //    });
            //}
            var refundPrice = order.OrderDetails
                  .Where(od => od.IsReturn)
                  .SelectMany(od => od.Refunds)
                  .Sum(r => r.RefundAmount);
            var discountPrice = order.OrderDiscounts
                   .Where(od => od.IsUsed)
                   .Sum(od =>
                       od.Discount.DiscountAmount ??
                       //(o.TotalAmount * od.Discount.DiscountPercent.Value / 100)
                       (od.Discount.MaxDiscountAmount.HasValue
                           ? Math.Min(order.TotalAmount * od.Discount.DiscountPercent.Value / 100, od.Discount.MaxDiscountAmount.Value)
                           : order.TotalAmount * od.Discount.DiscountPercent.Value / 100)
                   );
            var total = order.TotalAmount - discountPrice - refundPrice + order.ShippingFee;
            if (order == null)
                return BadRequest("Order not found");

            if (order.Status != 0)
                return BadRequest("Order is not valid to pay");
            var momoOrderId = $"{order.Id}_{DateTime.UtcNow.Ticks}";
            var momoResponse = await _momoService.CreatePaymentAsync(
                momoOrderId,
                total,
                $"Pay order {order.Id} by 3BRO Store"
            );

            if (momoResponse.ResultCode != 0)
                return BadRequest(momoResponse.Message);
           
            findPayment.PayUrl = momoResponse.PayUrl;
            findPayment.ExpiredUrlTime = DateTime.UtcNow.AddHours(1).AddMinutes(40);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                payUrl = momoResponse.PayUrl
            });
        }

        // IPN từ MoMo
        [HttpPost("momo/ipn")]
        public async Task<IActionResult> MomoIpn([FromBody] MomoIpnRequest ipn)
        {
            if (!_momoService.VerifyIpnSignature(ipn))
                return BadRequest("Invalid signature");
            var order = await _context.Order.FindAsync(ipn.OrderId);
            if (order == null)
                return NotFound();

            if (ipn.ResultCode == 0)
            {
                var findPayment = await _context.Payment.FirstOrDefaultAsync(p=>p.OrderId == order.Id);
                if (findPayment == null)
                {
                    return NotFound("Payment not found");
                }
                findPayment.Status = 1;
                findPayment.PaymentDate = DateTime.UtcNow;
                await _orderService.UpdateOrderStatus(order.Id, 2);
                await _shipmentService.AddNewShipmentAsync(order.Id);
                await _context.SaveChangesAsync();
            }
            return Ok();
        }
        [HttpPost]
        [Authorize]
        public async Task<ApiResponse<GetPaymentDTO>> AddNewPayment([FromQuery] Guid orderId)
        {
            return await _paymentService.AddNewPaymentAsync(orderId);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<ApiResponse<GetPaymentDTO>> DeletePayment([FromRoute] Guid id)
        {
            return await _paymentService.DeletePaymentAsync(id);
        }
        [HttpPut("{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<ApiResponse<GetPaymentDTO>> UpdateStatusPayment([FromRoute] Guid id, [FromQuery] int status)
        {
            return await _paymentService.UpdateStatusPayment(id, status);
        }
        [HttpGet("by-page")]
        [Authorize]
        public async Task<ApiResponse<GetPaymentDTO>> GetAllPaymentByPage([FromQuery] int curentPage, [FromQuery] int pageSize)
        {
            return await _paymentService.GetAllPaymentByPageAsync(curentPage, pageSize);
        }
        [HttpGet("total-sale")]
        [Authorize]
        public async Task<ApiResponse<TotalSaleDTO>> GetAllSaleByMonth()
        {
            return await _paymentService.GetAllSalesByMonth();
        }

        [HttpGet("top-product-revenue")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<TopProductDTO>> GetTopProducts([FromQuery] int pageSize)
        {
            return await _paymentService.TopRevenue(pageSize);
        }

        [HttpGet("total-revenue")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<decimal>> GetTotalRevenue()
        {
            return await _paymentService.GetTotalRevenue();
        }
    }
}
