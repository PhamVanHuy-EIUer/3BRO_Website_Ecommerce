using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface ICartItemRepository
    {
        Task<ApiResponse<CartItemDTO>> AddNewItemToCartAsync(Guid productId,Guid userId,int quantity);
        Task<ApiResponse<CartItemDTO>> RemoveItemFromCartAsync(Guid productId, Guid userId);
        Task<ApiResponse<CartProductDTO>> ShowItemsInCartAsync(Guid userId);
        Task<ApiResponse<decimal>> PreviewTotalPriceAsync(List<CheckOutItemDTO> items);
        Task<ApiResponse<string>> DeleteListProductsInCartAsync(List<DeleteProductInCartDTO> listProducts, Guid userId);
        Task<ApiResponse<CartProductDTO>> ChangeQuantityProductOfCartItem( Guid cartItemId,int quantity);
    }
}
