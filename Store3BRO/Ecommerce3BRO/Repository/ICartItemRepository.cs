using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface ICartItemRepository
    {
        Task<ApiResponse<CartItemDTO>> AddNewItemToCartAsync(Guid productId,Guid userId);
        Task<ApiResponse<CartItemDTO>> RemoveItemFromCartAsync(Guid productId, Guid userId);
        Task<ApiResponse<GetProductDTO>> ShowItemsInCartAsync(Guid userId);
    }
}
