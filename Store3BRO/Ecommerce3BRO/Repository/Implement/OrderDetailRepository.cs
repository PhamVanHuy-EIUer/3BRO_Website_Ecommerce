using Ecommerce3BRO.Data;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class OrderDetailRepository : IOrderDetailRepository
    {
        private readonly Ecommerce3BROContext _context;
        public OrderDetailRepository(Ecommerce3BROContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<string>> RemoveOrderDetailAsync(Guid orderDetailId)
        {
             var findOrderDetail = await _context.OrderDetail.FirstOrDefaultAsync(od => od.Id == orderDetailId);
            if (findOrderDetail == null)
            {
                return new ApiResponse<string>(null,null, "404", "Order detail is not found", true, 0, 0, 0, 0,null, null, null);
            }
            findOrderDetail.IsReturn = true;
            var newRefund = new Refund
            {
                Id = Guid.NewGuid(),
                OrderDetailId = findOrderDetail.Id,
                RefundAmount = findOrderDetail.UnitPrice * findOrderDetail.Quantity,
                CreatedDate = DateTime.UtcNow
            };
            await _context.Refund.AddAsync(newRefund);
            var product = await _context.Product.FirstOrDefaultAsync(p => p.Id == findOrderDetail.ProductId);
            if (product != null)
            {
                product.Stock += findOrderDetail.Quantity;
            }
            await _context.SaveChangesAsync();
            return new ApiResponse<string>(null,null, "200", "Order detail removed successfully", true, 0, 0, 0, 0,null, null, null);
        }
    }
}
