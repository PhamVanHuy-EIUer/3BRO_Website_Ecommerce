using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IWebHostEnvironment _env;
        public CategoryRepository(Ecommerce3BROContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }
        public async Task<ApiResponse<GetCategoryDTO>> AddNewCategory(CategoryDTO category, IFormFile image)
        {
            var findCategory = _context.Category.FirstOrDefault(c => c.CategoryName == category.CategoryName);
            if (findCategory != null)
            {
                return new ApiResponse<GetCategoryDTO>(null, null, "400", "Category name already exists", false, 0, 0, 0, 0, null, null, null);
            }
            string? imageUrl = null;

            if (image != null)
            {
                var ext = Path.GetExtension(image.FileName).ToLower();
                var allowExt = new[] { ".png", ".jpg", ".jpeg", ".webp" };

                if (!allowExt.Contains(ext))
                    return new ApiResponse<GetCategoryDTO>(null, null, "400", "Image is invalid", false, 0, 0, 0, 0, null, null, null);

                var folderPath = Path.Combine(
                    _env.WebRootPath,
                    "images",
                    "categories"
                );

                Directory.CreateDirectory(folderPath);

                var fileName = $"{Guid.NewGuid()}{ext}";
                var fullPath = Path.Combine(folderPath, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await image.CopyToAsync(stream);

                imageUrl = $"/images/categories/{fileName}";
            }
            Category newCategory = new Category
            {
                CategoryName = category.CategoryName,
                Description = category.Description,
                IsActive = true,
                CreatedDate = DateTime.UtcNow,
                ImageUrl = imageUrl
            };
            await _context.Category.AddAsync(newCategory);
            await _context.SaveChangesAsync();
            GetCategoryDTO newCategoryDto = new GetCategoryDTO
            {
                Id = newCategory.Id,
                CategoryName = newCategory.CategoryName,
                Description = newCategory.Description,
                ImageUrl = imageUrl
            };
            return new ApiResponse<GetCategoryDTO>(null, newCategoryDto, "200", "Add new category successfully", true, 0, 0, 0, 0, null, null, null);
        }


        public async Task<ApiResponse<GetCategoryDTO>> DeleteCategory(Guid id)
        {
            var category = _context.Category.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return new ApiResponse<GetCategoryDTO>(null, null, "404", "Category not found", false, 0, 0, 0, 0, null, null, null);
            }
            category.IsActive = false;
            if (!string.IsNullOrEmpty(category.ImageUrl))
            {
                var oldImagePath = Path.Combine(
                    _env.WebRootPath,
                    category.ImageUrl.TrimStart('/')
                );

                if (File.Exists(oldImagePath))
                    File.Delete(oldImagePath);
            }
            await _context.SaveChangesAsync();
            GetCategoryDTO categoryDto = new GetCategoryDTO
            {
                Id = category.Id,
                CategoryName = category.CategoryName,
                Description = category.Description,
                ImageUrl = category.ImageUrl
            };
            return new ApiResponse<GetCategoryDTO>(null,categoryDto, "200", "Category deleted successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetCategoryDTO>> GetAllCategoryAsync()
        {
            var categories = _context.Category.Where(c => c.IsActive == true).Select(category => new GetCategoryDTO()
            {
                Id = category.Id,
                CategoryName = category.CategoryName,
                Description = category.Description,
                ImageUrl = category.ImageUrl
            }).ToList();
            return new ApiResponse<GetCategoryDTO>(categories, null, "200", "Get all categories successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<NumberProductsInCategoryDTO>> GetNumberProductsInCategoryAsync()
        {
            var categories = await _context.Category.Where(c => c.IsActive).Select(category => new NumberProductsInCategoryDTO()
            {
                CategoryId = category.Id,
                CategoryName= category.CategoryName,
                TotalProducts= category.Products.Count(),
            }).ToListAsync();
            return new ApiResponse<NumberProductsInCategoryDTO>(categories, null, "200", "Get all products in category successfully", true, 0, 0, 0 ,0 , null, null, null);
        }

        public async Task<ApiResponse<GetCategoryDTO>> UpdateCategory(Guid id, CategoryDTO category,IFormFile? newImage)
        {
            var findCategory = _context.Category.FirstOrDefault(c => c.Id == id);
            if (findCategory == null)
            {
                return new ApiResponse<GetCategoryDTO>(null, null, "404", "Category not found", false, 0, 0, 0, 0, null, null, null);
            }
            findCategory.CategoryName = category.CategoryName;
            findCategory.Description = category.Description;
            if (newImage != null)
            {
                var ext = Path.GetExtension(newImage.FileName).ToLower();
                var allowExt = new[] { ".png", ".jpg", ".jpeg", ".webp" };
                if (!allowExt.Contains(ext))
                    return new ApiResponse<GetCategoryDTO>(null, null, "400", "Image is invaid", false, 0, 0, 0, 0, null, null, null);
                var folderPath = Path.Combine(
                    _env.WebRootPath,
                    "images",
                    "categories"

                );
                if (!string.IsNullOrEmpty(findCategory.ImageUrl))
                {
                    var oldImagePath = Path.Combine(
                        _env.WebRootPath,
                        findCategory.ImageUrl.TrimStart('/')
                    );

                    if (File.Exists(oldImagePath))
                        File.Delete(oldImagePath);
                }
                Directory.CreateDirectory(folderPath);
                var fileName = $"{Guid.NewGuid()}{ext}";
                var fullPath = Path.Combine(folderPath, fileName);
                using var stream = new FileStream(fullPath, FileMode.Create);
                await newImage.CopyToAsync(stream);
                findCategory.ImageUrl = $"/images/categories/{fileName}";

            }
            await _context.SaveChangesAsync();
            GetCategoryDTO getCategoryDTO = new GetCategoryDTO
            {
                Id = findCategory.Id,
                CategoryName = findCategory.CategoryName,
                Description = findCategory.Description,
                ImageUrl = findCategory.ImageUrl
            };
            return new ApiResponse<GetCategoryDTO>(null, getCategoryDTO, "200", "Update category successfully", true, 0, 0, 0, 0, null, null, null);
        }
    }
}
