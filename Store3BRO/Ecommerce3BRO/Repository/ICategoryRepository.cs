using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface ICategoryRepository
    {
        Task<ApiResponse<GetCategoryDTO>> GetAllCategoryAsync();
        Task<ApiResponse<GetCategoryDTO>> AddNewCategory(CategoryDTO category,IFormFile image);
        Task<ApiResponse<GetCategoryDTO>> UpdateCategory(Guid id, CategoryDTO category,IFormFile? newImage);
        Task<ApiResponse<GetCategoryDTO>> DeleteCategory(Guid id);
        Task<ApiResponse<NumberProductsInCategoryDTO>> GetNumberProductsInCategoryAsync();
    }
}
