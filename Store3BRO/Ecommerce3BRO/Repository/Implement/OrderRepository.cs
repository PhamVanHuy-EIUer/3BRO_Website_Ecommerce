
using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Helper.Enums;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class OrderRepository : IOrderRepository
    {
        private readonly Ecommerce3BROContext _context;
        public OrderRepository(Ecommerce3BROContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<OrderDTO>> AddNewOrderWithItemsAsync(Guid userId, OrderDTO order)
        {
            var findUser = await _context.User.FindAsync(userId);
            if (findUser == null)
            {
                return new ApiResponse<OrderDTO>(null, null, "401", "Unauthorize", false, 0, 0, 0, 0, null, null, null);
            }
            var productIds = order.Items.Select(i => i.ProductId).ToList();
            var products = await _context.Product.Where(p => productIds.Contains(p.Id)).ToListAsync();
            if (products.Count != productIds.Count)
            {
                return new ApiResponse<OrderDTO>(null, null, "400", "Some products not found", false, 0, 0, 0, 0, null, null, null);
            }
            var newOrder = new Order
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                PaymentMethod = order.PaymentMethod,
                ShippingAddress = order.ShippingAddress,
                Status = 0,
                ShippingFee = 0,
                CreatedDate = DateTime.UtcNow,
                OrderDetails = new List<OrderDetail>()
            };

            decimal totalAmount = 0;
            foreach (var item in order.Items)
            {
                var findProduct = await _context.Product.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                if (findProduct.Stock < item.Quantity)
                {
                    return new ApiResponse<OrderDTO>(null, null, "400", $"Product {findProduct.ProductName} is out of stock", false, 0, 0, 0, 0, null, null, null);
                }
                var orderDetail = new OrderDetail
                {
                    OrderId = newOrder.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = findProduct.Price,
                    CreatedDate = DateTime.UtcNow,
                    IsReturn = false
                };
                await _context.OrderDetail.AddAsync(orderDetail);
                findProduct.Stock -= item.Quantity;
                totalAmount += orderDetail.Quantity * orderDetail.UnitPrice;
            }
            newOrder.TotalAmount = totalAmount + newOrder.ShippingFee;
            await _context.Order.AddAsync(newOrder);
            await _context.SaveChangesAsync();
            return new ApiResponse<OrderDTO>(null, order, "200", "Order created successfully", true, 0, 0, 0, 0, "Pending", null, null);
        }

        public async Task<ApiResponse<GetOrderByAdminDTO>> GetAllOrderByAdminAsync()
        {
            var orders = await _context.Order.Select(o => new GetOrderByAdminDTO
            {
                OrderId = o.Id,
                CustomerName = o.User.FullName,

                ProductNames = string.Join(", ",
            o.OrderDetails
             .Select(od => od.Product.ProductName)
             .Distinct()
        ),

                Amount = o.OrderDetails.Sum(od => od.Quantity),
                TotalPrice = o.TotalAmount,
                Status = ((OrderStatus)o.Status).ToString(),
                //RefundPrice = o.OrderDetails.Where(od => od.IsReturn).Sum(od => od.Quantity * od.UnitPrice),
                //NetRevenue = o.TotalAmount - o.OrderDetails.Where(od => od.IsReturn).Sum(od => od.Quantity * od.UnitPrice)
                RefundPrice = o.OrderDetails.Where(od => od.IsReturn).SelectMany(od=>od.Refunds).Sum(r => r.RefundAmount),
                NetRevenue = o.TotalAmount - o.OrderDetails.Where(od => od.IsReturn).SelectMany(od => od.Refunds).Sum(r => r.RefundAmount)
            })
    .ToListAsync();
            return new ApiResponse<GetOrderByAdminDTO>(orders, null, "200", "Orders retrieved successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<UserOrderItem>> GetAllOrderByUserAsync(Guid userId)
        {
            var items = await _context.OrderDetail
    .Where(od => od.Order.UserId == userId && od.IsReturn==false)
    .Select(od => new UserOrderItem
    {
        OrderItem = od.Id,
        ProductName = od.Product.ProductName,
        ImageUrl = od.Product.ImageUrl,
        Price = od.UnitPrice,
        Quantity = od.Quantity,
        TotalPrice = od.UnitPrice * od.Quantity
    }).ToListAsync();
            return new ApiResponse<UserOrderItem>(items, null, "200", "User orders retrieved successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetOrderByAdminDTO>> GetOrderByStatus(string status)
        {
            var orders = await _context.Order.Where(o=>((OrderStatus)o.Status).ToString()==status).Select(o => new GetOrderByAdminDTO
            {
                OrderId = o.Id,
                CustomerName = o.User.FullName,

                ProductNames = string.Join(", ",
            o.OrderDetails
             .Select(od => od.Product.ProductName)
             .Distinct()
        ),

                Amount = o.OrderDetails.Sum(od => od.Quantity),
                TotalPrice = o.TotalAmount,
                Status = ((OrderStatus)o.Status).ToString()
            })
    .ToListAsync();
            return new ApiResponse<GetOrderByAdminDTO>(orders, null, "200", "Orders retrieved successfully", true, 0, 0, 0, 0, null, null, null);
        }
        

        public async Task<ApiResponse<Order>> RemoveOrderAsync(Guid orderId)
        {
            var findOrder = _context.Order.Include(o => o.OrderDetails).ThenInclude(od => od.Product).FirstOrDefault(o => o.Id == orderId);
            if (findOrder == null)
            {
                return new ApiResponse<Order>(null, null, "404", "Order not found", false, 0, 0, 0, 0, null, null, null);
            }
            if (findOrder.Status != 0)
            {
                return new ApiResponse<Order>(null, null, "400", "Only pending orders can be cancelled", false, 0, 0, 0, 0, null, null, null);
            }
            findOrder.Status = 4;
            foreach (var item in findOrder.OrderDetails)
            {
                item.Product.Stock += item.Quantity;
            }
            await _context.SaveChangesAsync();
            return new ApiResponse<Order>(null, findOrder, "200", "Order cancelled successfully", true, 0, 0, 0, 0, "Cancelled", null, null);
        }
    }
}
