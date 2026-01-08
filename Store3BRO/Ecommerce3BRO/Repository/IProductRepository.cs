using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IProductRepository
    {
        Task<ApiResponse<GetProductDTO>> GetAllProductAsync();
        Task<ApiResponse<GetProductDTO>> GetProductByIdAsync(Guid id);
        Task<ApiResponse<GetProductDTO>> AddNewProductAsync(ProductDTO product,IFormFile image);
        Task<ApiResponse<GetProductDTO>> UpdateProductAsync(Guid id, ProductDTO product,IFormFile newImage);
        Task<ApiResponse<GetProductDTO>> DeleteProductAsync(Guid id);
        Task<ApiResponse<GetProductDTO>> GetProductByCategoryIdAsync(Guid categoryId);
        Task<ApiResponse<GetProductDTO>> SearchProductsAsync(string keyword);
        Task<ApiResponse<GetProductDTO>> GetProductByPages(int currentPage, int pageSize);
        Task<ApiResponse<GetOrderProductDTO>> GetMostOrderedProductByPages(int currentPage, int pageSize);
    }
}
 