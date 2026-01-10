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

        //Api get all categories
        [HttpGet]
        public Task<ApiResponse<GetCategoryDTO>> GetAllCategories()
        {
            return _categoryService.GetAllCategoryAsync();
        }

        //Api add new category
        [HttpPost]
        public async Task<ApiResponse<GetCategoryDTO>> AddNewCategory([FromForm] CategoryDTO category,IFormFile image)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetCategoryDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            return await _categoryService.AddNewCategory(category,image);
        }

        //Api update category
        [HttpPut("{id}")]
        public async Task<ApiResponse<GetCategoryDTO>> UpdateCategory(Guid id, [FromForm] CategoryDTO category,IFormFile? newImage)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetCategoryDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            return await _categoryService.UpdateCategory(id, category,newImage);
        }

        //Api delete category
        [HttpDelete("{id}")]
        public async Task<ApiResponse<GetCategoryDTO>> DeleteCategory(Guid id)
        {
            return await _categoryService.DeleteCategory(id);
        }
    }
}
