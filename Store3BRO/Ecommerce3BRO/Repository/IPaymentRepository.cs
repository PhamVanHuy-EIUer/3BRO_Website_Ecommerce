using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IPaymentRepository
    {
        Task<ApiResponse<GetPaymentDTO>> AddNewPaymentAsync(Guid orderId);
        Task<ApiResponse<GetPaymentDTO>> GetAllPaymentByPageAsync(int currentPage,int pageSize);
        Task<ApiResponse<GetPaymentDTO>> UpdateStatusPayment(Guid paymentId,int status);
        Task<ApiResponse<GetPaymentDTO>> DeletePaymentAsync(Guid paymentId);
        Task<ApiResponse<GetPaymentDTO>> GetAllPaidPayment();
    }
}
