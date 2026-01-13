using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IDiscountRepository
    {
        Task<ApiResponse<GetDiscountDTO>> AddNewDiscountAsync(DiscountDTO discountDTO);
        Task<ApiResponse<GetDiscountDTO>> GetAllDiscountAsync();
        Task<ApiResponse<GetDiscountDTO>> GetDiscountByIdAsync(Guid id);
        Task<ApiResponse<GetDiscountDTO>> UpdateDiscountAsync(Guid id, DiscountDTO discountDTO);
        Task<ApiResponse<GetDiscountDTO>> DeleteDiscountAsync(Guid id);
        Task<List<GetDiscountDTO>> GetDiscountByUser(decimal price);
        Task  ApplyDiscountToOrder(Guid orderId, Guid discount);
    }
}
