
using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Helper;
using Ecommerce3BRO.Helper.Enums;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;

namespace Ecommerce3BRO.Repository.Implement
{
    public class OrderRepository : IOrderRepository
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IDiscountRepository _discount;
        private readonly ShopLocation _shop;
        public OrderRepository(Ecommerce3BROContext context, IDiscountRepository discount,ShopLocation shop)
        {
            _context = context;
            _discount = discount;
            _shop = shop;
        }
        public async Task<ApiResponse<GetOrderDTO>> AddNewOrderWithItemsAsync(Guid userId, OrderDTO order)
        {
            var findUser = await _context.User.FindAsync(userId);
            if (findUser == null)
            {
                return new ApiResponse<GetOrderDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var productIds = order.Items.Select(i => i.ProductId).ToList();
            var products = await _context.Product.Where(p => productIds.Contains(p.Id)).ToListAsync();
            if (products.Count != productIds.Count)
            {
                return new ApiResponse<GetOrderDTO>(null, null, "400", "Some products not found", false, 0, 0, 0, 0, null, null, null);
            }
            var findLocation = await _context.UserLocation.FirstOrDefaultAsync(l=>l.UserId==findUser.Id&&l.IsActive);
            decimal shippingFee = CountShippingFee.CountFee((double)_shop.Latitude, (double)_shop.Longitude, (double)findLocation.Latitude, (double)findLocation.Longitude);
            var newOrder = new Order
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                PaymentMethod = order.PaymentMethod,
                ShippingAddress = order.ShippingAddress,
                Status = 0,
                ShippingFee = shippingFee,
                CreatedDate = DateTime.UtcNow,
                OrderDetails = new List<OrderDetail>()
            };

            decimal totalAmount = 0;
            foreach (var item in order.Items)
            {
                var findProduct = await _context.Product.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                if (findProduct.Stock < item.Quantity)
                {
                    return new ApiResponse<GetOrderDTO>(null, null, "400", $"Product {findProduct.ProductName} is out of stock", false, 0, 0, 0, 0, null, null, null);
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
                if (findProduct.Stock == 0)
                {
                    findProduct.Status = 2;
                }
                totalAmount += orderDetail.Quantity * orderDetail.UnitPrice;
            }
            newOrder.TotalAmount = totalAmount;
            await _context.Order.AddAsync(newOrder);
            await _context.SaveChangesAsync();
            if (order.DiscountId != null)
            {
                await _discount.ApplyDiscountToOrder(newOrder.Id, (Guid)order.DiscountId);
            }
            var dto = new GetOrderDTO
            {
                Id = newOrder.Id,
                PaymentMethod = newOrder.PaymentMethod,
                ShippingAddress = newOrder.ShippingAddress
            };
            return new ApiResponse<GetOrderDTO>(null, dto, "200", "Order created successfully", true, 0, 0, 0, 0, "Pending", null, null);
        }

        public async Task<ApiResponse<GetOrderByAdminDTO>> GetAllOrderByAdminAsync()
        {
            var orders = await _context.Order
             .Include(o => o.User)
             .Include(o => o.OrderDetails).ThenInclude(od => od.Product)
             .Include(o => o.OrderDetails).ThenInclude(od => od.Refunds)
             .Include(o => o.OrderDiscounts).ThenInclude(od => od.Discount)
             .Include(o=>o.Shipments).OrderByDescending(o=>o.CreatedDate)
             .ToListAsync();
            var result = orders.Select(o =>
            {
                var refundPrice = o.OrderDetails
                    .Where(od => od.IsReturn)
                    .SelectMany(od => od.Refunds)
                    .Sum(r => r.RefundAmount);

                var discountPrice = o.OrderDiscounts
                    .Where(od => od.IsUsed)
                    .Sum(od =>
                        od.Discount.DiscountAmount ??
                        //(o.TotalAmount * od.Discount.DiscountPercent.Value / 100)
                        (od.Discount.MaxDiscountAmount.HasValue
                            ? Math.Min(o.TotalAmount * od.Discount.DiscountPercent.Value / 100, od.Discount.MaxDiscountAmount.Value)
                            : o.TotalAmount * od.Discount.DiscountPercent.Value / 100)
                    );

                return new GetOrderByAdminDTO
                {
                    OrderId = o.Id,
                    CustomerName = o.User.FullName,
                    ProductNames = string.Join(", ",
                        o.OrderDetails.Select(od => od.Product.ProductName).Distinct()),
                    Amount = o.OrderDetails.Sum(od => od.Quantity),
                    TotalPrice = o.TotalAmount,
                    Status = ((OrderStatus)o.Status).ToString(),
                    RefundPrice = refundPrice,
                    DiscountPrice = discountPrice,
                    NetRevenue = o.TotalAmount - refundPrice - discountPrice + o.ShippingFee,
                    ShipmentId = o.Shipments.FirstOrDefault()?.Id,
            
                };
            }).ToList();
            return new ApiResponse<GetOrderByAdminDTO>(result, null, "200", "Orders retrieved successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<UserOrderDTO>> GetAllOrderByUserAsync(Guid userId)
        {
            var orders = await _context.Order
                .Where(o => o.UserId == userId).OrderByDescending(o=>o.OrderDate)
                .Include(o => o.OrderDetails).ThenInclude(od => od.Product)
                 .Include(o => o.OrderDetails).ThenInclude(od => od.Refunds)
                .Include(o => o.OrderDiscounts).ThenInclude(od => od.Discount)
                .Include(o => o.Payments)
                .ToListAsync();

            var result = orders.Select(o =>
            {
                var refundPrice = o.OrderDetails
                  .Where(od => od.IsReturn)
                  .SelectMany(od => od.Refunds)
                  .Sum(r => r.RefundAmount);
                var subTotal = o.OrderDetails.Where(od => !od.IsReturn)
                    .Sum(od => od.UnitPrice * od.Quantity);

                var discountAmount = o.OrderDiscounts
                    .Where(od => od.IsUsed)
                    .Sum(od =>
                        od.Discount.DiscountAmount ??
                        //(o.TotalAmount * od.Discount.DiscountPercent.Value / 100)
                        (od.Discount.MaxDiscountAmount.HasValue
                            ? Math.Min(o.TotalAmount * od.Discount.DiscountPercent.Value / 100, od.Discount.MaxDiscountAmount.Value)
                            : o.TotalAmount * od.Discount.DiscountPercent.Value / 100)
                    );

                return new UserOrderDTO
                {
                    OrderId = o.Id,
                    CreatedDate = o.CreatedDate,
                    Status = ((OrderStatus)o.Status).ToString(),

                    Items = o.OrderDetails
                        .Where(od => !od.IsReturn)
                        .Select(od => new UserOrderItem
                        {
                            OrderItemId = od.Id,
                            ProductId = od.ProductId,
                            ProductName = od.Product.ProductName,
                            ImageUrl = od.Product.ImageUrl,
                            Price = od.UnitPrice,
                            Quantity = od.Quantity,
                            TotalPrice = od.UnitPrice * od.Quantity,
                        }).ToList(),
                    ShippingFee = o.ShippingFee,
                    SubTotal = subTotal,
                    DiscountAmount = discountAmount - (o.OrderDetails.Where(od => od.IsReturn).Sum(od => od.Quantity * od.UnitPrice) - refundPrice),
                    TotalAmount = subTotal + o.ShippingFee - (discountAmount - (o.OrderDetails.Where(od => od.IsReturn).Sum(od => od.Quantity * od.UnitPrice) - refundPrice)),
                
                    PaymentStatus = o.Payments.FirstOrDefault()?.Status,
                    PaymentMethod = o.PaymentMethod

                };
            }).ToList();

            return new ApiResponse<UserOrderDTO>(result, null, "200", "User orders retrieved successfully", true, 0, 0, 0, 0, null, null, null);
        }


        public async Task<ApiResponse<GetOrderByAdminDTO>> GetOrderByStatus(string status)
        {
            var orders = await _context.Order.Where(o => ((OrderStatus)o.Status).ToString() == status).Select(o => new GetOrderByAdminDTO
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

        public async Task<ApiResponse<ViewOrderDetailDTO>> GetOrderDetailByIdAsync(Guid orderId)
        {
            var findOrder = await _context.Order.Include(o => o.OrderDetails).ThenInclude(od => od.Product)
                .Include(o => o.OrderDetails).ThenInclude(od => od.Refunds)
                .Include(o => o.OrderDiscounts).ThenInclude(od => od.Discount)
                .FirstOrDefaultAsync(o => o.Id == orderId);
            if (findOrder == null)
            {
                return new ApiResponse<ViewOrderDetailDTO>(null, null, "404", "Order not found", false, 0, 0, 0, 0, null, null, null);
            }
            var detailOrders = findOrder.OrderDetails.Select(od => new ViewOrderDetailDTO()
            {
                ImageUrl = od.Product.ImageUrl,
                OrderItemId = od.Id,
                ProductName = od.Product.ProductName,
                Price = od.UnitPrice,
                Quantity = od.Quantity,
                TotalPrice = od.UnitPrice * od.Quantity,
                IsReturn = od.IsReturn,
                ShippingFee = findOrder.ShippingFee
            }).ToList();
            return new ApiResponse<ViewOrderDetailDTO>(detailOrders, null, "200", "Order details retrieved successfully", true, 0, 0, 0, 0, null, null, null);
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
            var findDiscounts = _context.OrderDiscount.Where(od => od.OrderId == orderId).ToList();
            foreach (var discount in findDiscounts)
            {
                _context.OrderDiscount.Remove(discount);
                var findDiscount = await _context.Discount.FirstOrDefaultAsync(d => d.Id == discount.DiscountId);
                findDiscount.Quantity += 1;
                await _context.SaveChangesAsync();
            }
            await _context.SaveChangesAsync();
            return new ApiResponse<Order>(null, findOrder, "200", "Order cancelled successfully", true, 0, 0, 0, 0, "Cancelled", null, null);
        }

        public async Task<ApiResponse<OrderDTO>> UpdateOrderStatus(Guid orderId, int status)
        {
            var findOrder = await _context.Order.FirstOrDefaultAsync(o => o.Id == orderId);
            if (findOrder == null)
            {
                return new ApiResponse<OrderDTO>(null, null, "404", "Order not found", false, 0, 0, 0, 0, null, null, null);
            }
            findOrder.Status = status;
            await _context.SaveChangesAsync();
            return new ApiResponse<OrderDTO>(null, null, "200", "Order status updated successfully", true, 0, 0, 0, 0, ((OrderStatus)status).ToString(), null, null);
        }
    }
}
