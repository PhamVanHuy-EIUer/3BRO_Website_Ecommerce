using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Helper.Enums;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : Controller
    {
        private readonly IMomoService _momoService;
        private readonly IOrderRepository _orderRepository;
        private readonly Ecommerce3BROContext _context;
        private readonly IPaymentRepository _paymentService;

        public PaymentController(IMomoService momoService, IOrderRepository orderRepository, Ecommerce3BROContext context, IPaymentRepository paymentService)
        {
            _momoService = momoService;
            _orderRepository = orderRepository;
            _context = context;
            _paymentService = paymentService;
        }

        // User bấm "Thanh toán MoMo"
        [HttpPost("momo")]
        public async Task<IActionResult> PayWithMomo(MomoCheckoutRequest request)
        {
            var order = await _context.Order.FindAsync(request.OrderId);

            if (order == null)
                return BadRequest("Order not found");

            if (order.Status != 0)
                return BadRequest("Order is not valid to pay");

            var momoResponse = await _momoService.CreatePaymentAsync(
                order.Id,
                order.TotalAmount,
                $"Pay order {order.Id} by 3BRO Store"
            );

            if (momoResponse.ResultCode != 0)
                return BadRequest(momoResponse.Message);

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
                await _context.SaveChangesAsync();
            }
            return Ok();
        }
        [HttpPost]
        public async Task<ApiResponse<GetPaymentDTO>> AddNewPayment([FromQuery] Guid orderId)
        {
            return await _paymentService.AddNewPaymentAsync(orderId);
        }
        [HttpDelete("{id}")]
        public async Task<ApiResponse<GetPaymentDTO>> DeletePayment([FromRoute] Guid id)
        {
            return await _paymentService.DeletePaymentAsync(id);
        }
        [HttpPut("{id}")]
        public async Task<ApiResponse<GetPaymentDTO>> UpdateStatusPayment([FromRoute] Guid id, [FromQuery] int status)
        {
            return await _paymentService.UpdateStatusPayment(id, status);
        }
        [HttpGet("by-page")]
        public async Task<ApiResponse<GetPaymentDTO>> GetAllPaymentByPage([FromQuery] int curentPage, [FromQuery] int pageSize)
        {
            return await _paymentService.GetAllPaymentByPageAsync(curentPage, pageSize);
        }
    }
}
