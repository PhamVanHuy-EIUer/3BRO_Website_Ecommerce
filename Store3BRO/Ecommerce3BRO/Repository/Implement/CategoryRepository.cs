using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository.Implement
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly Ecommerce3BROContext _context;
        public CategoryRepository(Ecommerce3BROContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<Category>> AddNewCategory(CategoryDTO category)
        {
            var findCategory = _context.Category.FirstOrDefault(c => c.CategoryName == category.CategoryName);
            if (findCategory != null)
            {
                return new ApiResponse<Category>(null, null, "400", "Category name already exists", false, 0, 0, 0, 0, null, null, null);
            }
            Category newCategory = new Category
            {
                CategoryName = category.CategoryName,
                Description = category.Description,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            };
            await _context.Category.AddAsync(newCategory);
            await _context.SaveChangesAsync();
            return new ApiResponse<Category>(null, newCategory, "200", "Add new category successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<Category>> DeleteCategory(Guid id)
        {
            var category = _context.Category.FirstOrDefault(c => c.Id == id);
            if(category == null)
            {
                return new ApiResponse<Category>(null, null, "404", "Category not found", false, 0, 0, 0, 0, null, null, null);
            }
            category.IsActive = false;
            await _context.SaveChangesAsync();
            return  new ApiResponse<Category>(null, category, "200", "Category deleted successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<Category>> GetAllCategoryAsync()
        {
            var categories = _context.Category.Where(c => c.IsActive == true).ToList();
            return new ApiResponse<Category>(categories, null, "200", "Get all categories successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<Category>> UpdateCategory(Guid id, CategoryDTO category)
        {
            var findCategory = _context.Category.FirstOrDefault(c => c.Id == id);
            if (findCategory == null)
            {
                return new ApiResponse<Category>(null, null, "404", "Category not found", false, 0, 0, 0, 0, null, null, null);
            }
            findCategory.CategoryName = category.CategoryName;
            findCategory.Description = category.Description;
            await _context.SaveChangesAsync();
            return new ApiResponse<Category>(null, findCategory, "200", "Update category successfully", true, 0, 0, 0, 0, null, null, null);
        }
    }
}
