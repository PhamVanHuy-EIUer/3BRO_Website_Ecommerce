using Azure.Core;
using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Helper;
using Ecommerce3BRO.Helper.Enums;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly Ecommerce3BROContext _context;
        private readonly TakeCurrentTime _time;
        public PaymentRepository(Ecommerce3BROContext context, TakeCurrentTime time)
        {
            _context = context;
            _time = time;
        }
        public async Task<ApiResponse<GetPaymentDTO>> AddNewPaymentAsync(Guid orderId)
        {
            var order = await _context.Order
          .Include(o => o.User)
          .Include(o => o.OrderDetails).ThenInclude(od => od.Product)
          .Include(o => o.OrderDetails).ThenInclude(od => od.Refunds)
          .Include(o => o.OrderDiscounts).ThenInclude(od => od.Discount).FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null)
            {
                return new ApiResponse<GetPaymentDTO>(null, null, "404", "Payment not found", false, 0, 0, 0, 0, null, null, null);
            }
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

            var newPayment = new Payment
            {
                OrderId = orderId,
                Amount = total,
                CreatedDate = DateTime.UtcNow,
                PaymentMethod = order.PaymentMethod,
                Status = 0,
                TransactionCode = Guid.NewGuid().ToString("N")
            };
            await _context.Payment.AddAsync(newPayment);
            await _context.SaveChangesAsync();
            var dto = new GetPaymentDTO()
            {
                Amount = newPayment.Amount,
                CreatedDate = newPayment.CreatedDate,
                PaymentMethod = newPayment.PaymentMethod,
                Status = ((PaymentStatus)newPayment.Status).ToString(),
                TransactionCode = newPayment.TransactionCode,
                OrderUserName = order.User.FullName,
                Id = newPayment.Id
            };
            return new ApiResponse<GetPaymentDTO>(null, dto, "200", "Add payment successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetPaymentDTO>> DeletePaymentAsync(Guid paymentId)
        {
            var findPayment = await _context.Payment.FindAsync(paymentId);
            if (findPayment == null)
            {
                return new ApiResponse<GetPaymentDTO>(null, null, "404", "Payment not found", false, 0, 0, 0, 0, null, null, null);
            }
            findPayment.Status = 2;
            await _context.SaveChangesAsync();
            return new ApiResponse<GetPaymentDTO>(null, null, "200", "Deleted payment successfully", true, 0, 0, 0, 0, null, null, null);

        }

        //public async Task<ApiResponse<GetPaymentDTO>> GetAllPaidPayment()
        //{
        //    var payments = await _context.Payment.Include(p => p.Order).ThenInclude(o => o.User).Where(p=>p.Status==1)
        //        .OrderByDescending(p => p.CreatedDate)
        //       .Select(p => new GetPaymentDTO
        //       {
        //           Amount = p.Amount,
        //           CreatedDate = p.CreatedDate,
        //           Id = p.Id,
        //           OrderUserName = p.Order.User.FullName,
        //           PaymentDate = p.PaymentDate,
        //           PaymentMethod = p.PaymentMethod,
        //           Status = ((PaymentStatus)p.Status).ToString(),
        //           TransactionCode = p.TransactionCode
        //       }).ToListAsync();
        //    return new ApiResponse<GetPaymentDTO>(payments, null, "200", "Get all payment by page successfully", true, 0,0,0,0, null, null, null);
        //}

        public async Task<ApiResponse<GetPaymentDTO>> GetAllPaymentByPageAsync(int currentPage, int pageSize)
        {
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;
            var totalItems = _context.Payment.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var payments = await _context.Payment.Include(p => p.Order).ThenInclude(o => o.User).OrderByDescending(p => p.CreatedDate).
                Skip((currentPage - 1) * pageSize).Take(pageSize).Select(p => new GetPaymentDTO
                {
                    Amount = p.Amount,
                    CreatedDate = p.CreatedDate,
                    Id = p.Id,
                    OrderUserName = p.Order.User.FullName,
                    PaymentDate = p.PaymentDate,
                    PaymentMethod = p.PaymentMethod,
                    Status = ((PaymentStatus)p.Status).ToString(),
                    TransactionCode = p.TransactionCode
                }).ToListAsync();
            return new ApiResponse<GetPaymentDTO>(payments, null, "200", "Get all payment by page successfully", true, currentPage, pageSize, totalPages, totalItems, null, null, null);
        }

        public async Task<ApiResponse<TotalSaleDTO>> GetAllSalesByMonth()
        {
            var payments = await _context.Payment.Where(p => p.Status == 1).ToListAsync();
            var currentTime = _time.currentime();
            var pastTime = _time.sixPastTime();
            var listSale = payments.Where(p => p.PaymentDate >= pastTime && p.PaymentDate < currentTime)
                .GroupBy(p => new
                {
                    Year = p.PaymentDate.Value.Year,
                    Month = p.PaymentDate.Value.Month,
                }).Select(g => new TotalSaleDTO
                {
                    Year = g.Key.Year,
                    Month = ((MonthEnum)g.Key.Month).ToString(),
                    NumOfProduct = g.Count(),
                    TotalSale = g.Sum(x => x.Amount)
                }).ToList();
            var result = Enumerable.Range(0, 6)
         .Select(i =>
    {
        var date = currentTime.AddMonths(-6 + i);
        var sale = listSale.FirstOrDefault(s =>
            s.Year == date.Year && s.Month == ((MonthEnum)date.Month).ToString());
        return new TotalSaleDTO
        {
            Year = date.Year,
            Month = ((MonthEnum)date.Month).ToString(),
            NumOfProduct = sale?.NumOfProduct ?? 0,
            TotalSale = sale?.TotalSale ?? 0
        };
    }).ToList();
            return new ApiResponse<TotalSaleDTO>(result, null, "200", "Get all total sales by month successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<decimal>> GetTotalRevenue()
        {
            var payments = await _context.Payment.Where(p => p.Status == 1).ToListAsync();
            var total = payments.Sum(p => p.Amount);
            return new ApiResponse<decimal>(null, total, "200", "Get top revenue products successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<TopProductDTO>> TopRevenue(int sizePage)
        {
            if (sizePage <= 0) sizePage = 5;
            


            var topProducts = await _context.Payment
                .Where(p => p.Status == 1) 
                .Include(p => p.Order)
                    .ThenInclude(o => o.OrderDetails)
                        .ThenInclude(od => od.Product)
                .SelectMany(p => p.Order.OrderDetails)
                .Where(od => !od.IsReturn) 
                .GroupBy(od => new
                {
                    od.ProductId,
                    od.Product.ProductName
                })
                .Select(g => new TopProductDTO
                {
                    productId = g.Key.ProductId,
                    productName = g.Key.ProductName,
                    totalRevenue = g.Sum(x => x.Quantity * x.UnitPrice),
                    

                })
                .OrderByDescending(x => x.totalRevenue)
                .Take(sizePage)
                .ToListAsync();

            return new ApiResponse<TopProductDTO>(topProducts, null, "200", "Get top revenue products successfully", true, 0, 0, 0, topProducts.Count, null, null, null);
        }

        public async Task<ApiResponse<GetPaymentDTO>> UpdateStatusPayment(Guid paymentId, int status)
        {
            var findPayment = await _context.Payment.FindAsync(paymentId);
            if (findPayment == null)
            {
                return new ApiResponse<GetPaymentDTO>(null, null, "404", "Payment not found", false, 0, 0, 0, 0, null, null, null);
            }
            findPayment.Status = 1;
            findPayment.PaymentDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return new ApiResponse<GetPaymentDTO>(null, null, "200", "Update payment successfully", true, 0, 0, 0, 0, null, null, null);

        }

    }
}
