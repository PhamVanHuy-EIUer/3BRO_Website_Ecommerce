using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : Controller
    {
        private readonly ICategoryRepository _categoryService;
        public CategoriesController(ICategoryRepository categoryService)
        {
            _categoryService = categoryService;
        }
        [HttpGet]
        public Task<ApiResponse<Category>> GetAllCategories()
        {
            return _categoryService.GetAllCategoryAsync();
        }
        [HttpPost]
        public async Task<ApiResponse<Category>> AddNewCategory([FromBody] CategoryDTO category)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<Category>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            return await _categoryService.AddNewCategory(category);
        }
        [HttpPut("{id}")]
        public async Task<ApiResponse<Category>> UpdateCategory(Guid id, [FromBody] CategoryDTO category)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<Category>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            return await _categoryService.UpdateCategory(id, category);
        }
        [HttpDelete("{id}")]
        public async Task<ApiResponse<Category>> DeleteCategory(Guid id)
        {
            return await _categoryService.DeleteCategory(id);
        }
    }
}
