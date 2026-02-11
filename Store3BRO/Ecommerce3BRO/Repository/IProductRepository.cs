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
        Task<ApiResponse<ShowCheckoutDTO>> GetProductWithAutoDiscountById(List<PreviewOderDTO> dto, Guid userId);
        Task<ApiResponse<ShowCheckoutDTO>> GetProductWithDiscountById(List<PreviewOderDTO> dto, Guid userId, string discountCode);
        Task<ApiResponse<GetProductDTO>> GetProductByPriceRange(decimal minPrice,decimal maxPrice,int currentPage,int pageSize);
        Task<ApiResponse<GetProductDTO>> GetProductByAscendingPrice(int currentPage, int pageSize);
        Task<ApiResponse<GetProductDTO>> GetProductByDecendingPrice(int currentPage, int pageSize);
        Task<ApiResponse<GetProductDTO>> UpdateProductStatus(Guid productId,int status);
        

    }
}
 