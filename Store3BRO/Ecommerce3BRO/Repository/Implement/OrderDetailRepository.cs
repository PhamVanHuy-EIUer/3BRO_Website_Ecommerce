using Ecommerce3BRO.Data;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class OrderDetailRepository : IOrderDetailRepository
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IOrderRepository _orderRepository;
        public OrderDetailRepository(Ecommerce3BROContext context, IOrderRepository orderRepository)
        {
            _context = context;
            _orderRepository = orderRepository;
        }
        public async Task<ApiResponse<string>> RemoveOrderDetailAsync(Guid orderDetailId)
        {
             var findOrderDetail = await _context.OrderDetail.FirstOrDefaultAsync(od => od.Id == orderDetailId);
            if (findOrderDetail == null)
            {
                return new ApiResponse<string>(null,null, "404", "Order detail is not found", true, 0, 0, 0, 0,null, null, null);
            }
            findOrderDetail.IsReturn = true;
            var subtotal = findOrderDetail.UnitPrice * findOrderDetail.Quantity;
            var order = await _context.Order.Include(o => o.OrderDiscounts).ThenInclude(od => od.Discount).Include(o => o.OrderDetails).FirstOrDefaultAsync(o => o.Id == findOrderDetail.OrderId);
            var appliedDiscount = order.OrderDiscounts.Where(od => od.IsUsed).Sum(od =>
        od.Discount.DiscountAmount ??
        order.TotalAmount * (od.Discount.DiscountPercent ?? 0) / 100
    );

            var newRefund = new Refund
            {
                Id = Guid.NewGuid(),
                OrderDetailId = findOrderDetail.Id,
                RefundAmount = subtotal- appliedDiscount *(subtotal/order.TotalAmount),
                CreatedDate = DateTime.UtcNow
            };
            await _context.Refund.AddAsync(newRefund);
            var product = await _context.Product.FirstOrDefaultAsync(p => p.Id == findOrderDetail.ProductId);
            if (product != null)
            {
                product.Stock += findOrderDetail.Quantity;
            }
            await _context.SaveChangesAsync();
            var findOrder = await _context.Order.FindAsync(findOrderDetail.OrderId);
            var orderDetails= await _context.OrderDetail.Where(od => od.OrderId == findOrderDetail.OrderId && od.IsReturn == false).ToListAsync();
            if (findOrder != null && orderDetails.Count == 0)
            {
                await _orderRepository.RemoveOrderAsync(findOrder.Id);
                await _context.SaveChangesAsync();
            }
            return new ApiResponse<string>(null,null, "200", "Order detail removed successfully", true, 0, 0, 0, 0,null, null, null);
        }
    }
}
