using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface ICategoryRepository
    {
        Task<ApiResponse<Category>> GetAllCategoryAsync();
        Task<ApiResponse<Category>> AddNewCategory(CategoryDTO category);
        Task<ApiResponse<Category>> UpdateCategory(Guid id, CategoryDTO category);
        Task<ApiResponse<Category>> DeleteCategory(Guid id);
    }
}
