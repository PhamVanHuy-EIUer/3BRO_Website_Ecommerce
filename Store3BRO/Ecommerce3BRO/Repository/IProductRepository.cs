using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IProductRepository
    {
        
        Task<ApiResponse<GetProductDTO>> GetAvailableProductsAsync();
        Task<ApiResponse<GetProductDTO>> GetProductByIdAsync(Guid id);
        Task<ApiResponse<GetProductDTO>> AddNewProductAsync(ProductDTO product,IFormFile image);
        Task<ApiResponse<GetProductDTO>> UpdateProductAsync(Guid id, ProductDTO product,IFormFile newImage);
        Task<ApiResponse<GetProductDTO>> DeleteProductAsync(Guid id);
        Task<ApiResponse<GetProductDTO>> GetProductByCategoryIdAsync(Guid categoryId);
        Task<ApiResponse<GetProductDTO>> SearchProductByPageAsync(string  keyword, int currentPage, int pageSize);
        Task<ApiResponse<GetProductDTO>> GetProductByPages(int currentPage, int pageSize);
        Task<ApiResponse<GetProductByAdminDTO>> GetAllProductByPageAsync(int currentPage, int pageSize);
        Task<ApiResponse<GetOrderProductDTO>> GetMostOrderedProductByPages(int currentPage, int pageSize);
        Task<ApiResponse<GetProductDTO>> GetProductByCategoryByPageAsync(Guid categoryId,int currentPage, int pageSize);
        Task <ApiResponse<ShowCheckoutDTO>> GetProductWithDiscountById(Guid productId,int quantity,Guid userId,string discountCode);
        Task<ApiResponse<ShowCheckoutDTO>> GetProductWithDiscountByCartItemId(CheckoutCartItemRequestDTO request,Guid UserId);
        Task<ApiResponse<ShowCheckoutDTO>> GetProductWithAutoDiscountById(Guid productId, int quantity,Guid userId);
        Task<ApiResponse<ShowCheckoutDTO>> GetProductWithAutoDiscountByCartItemListId(List<Guid> cartItemId, Guid userId);
        Task<ApiResponse<GetProductDTO>> GetProductByPriceRange(decimal minPrice,decimal maxPrice);
        Task<ApiResponse<GetProductDTO>> GetProductByAscendingPrice();
        Task<ApiResponse<GetProductDTO>> GetProductByDecendingPrice();
        Task<ApiResponse<TopProductDTO>> GetTopProducts(int pageSize);
        Task<ApiResponse<GetProductDTO>> UpdateProductStatus(Guid productId,int status);
       
    }
}
 