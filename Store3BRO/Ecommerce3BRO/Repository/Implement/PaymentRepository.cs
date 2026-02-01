using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Helper.Enums;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly Ecommerce3BROContext _context;
        public PaymentRepository(Ecommerce3BROContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<GetPaymentDTO>> AddNewPaymentAsync(Guid orderId)
        {
            var order = await _context.Order.Include(o=>o.User).FirstOrDefaultAsync(o=>o.Id==orderId);
            if (order == null)
            {
                return new ApiResponse<GetPaymentDTO>(null, null, "404", "Payment not found", false, 0, 0, 0, 0, null, null, null);
            }
            var newPayment = new Payment
            {
                OrderId = orderId,
                Amount = order.TotalAmount,
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
            if (findPayment == null) {
                return new ApiResponse<GetPaymentDTO>(null, null, "404", "Payment not found", false, 0, 0, 0, 0, null, null, null);
            }
            findPayment.Status = 2;
            await _context.SaveChangesAsync();
            return new ApiResponse<GetPaymentDTO>(null, null, "200", "Deleted payment successfully", true, 0, 0, 0, 0, null, null, null);

        }

        public async Task<ApiResponse<GetPaymentDTO>> GetAllPaymentByPageAsync(int currentPage,int pageSize)
        {
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;
            var totalItems = _context.Payment.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var payments = await _context.Payment.Include(p=>p.Order).ThenInclude(o=>o.User).OrderByDescending(p=>p.CreatedDate).
                Skip((currentPage-1)*pageSize).Take(pageSize).Select(p=> new GetPaymentDTO
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

        public async Task<ApiResponse<GetPaymentDTO>> UpdateStatusPayment(Guid paymentId,int status)
        {
            var findPayment = await _context.Payment.FindAsync(paymentId);
            if (findPayment == null)
            {
                return new ApiResponse<GetPaymentDTO>(null, null, "404", "Payment not found", false, 0, 0, 0, 0, null, null, null);
            }
            findPayment.Status = 1;
            await _context.SaveChangesAsync();
            return new ApiResponse<GetPaymentDTO>(null, null, "200", "Update payment successfully", true, 0, 0, 0, 0, null, null, null);

        }
    }
}
