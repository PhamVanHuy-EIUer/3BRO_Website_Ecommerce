using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class ProductRepository : IProductRepository
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IWebHostEnvironment _env;
        public ProductRepository(Ecommerce3BROContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<ApiResponse<GetProductDTO>> AddNewProductAsync(ProductDTO dto, IFormFile image)
        {
            //if (image == null || image.Length == 0)
            //{
            //    return new ApiResponse<GetProductDTO>(null, null, "400", "Please upload image", false, 0, 0, 0, 0, null, null, null);
            //}
            var findProduct = await _context.Product.FirstOrDefaultAsync(p => p.ProductName == dto.ProductName && p.Status == 1);
            if (findProduct != null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "400", "Product name already exists", false, 0, 0, 0, 0, null, null, null);
            }
            var categoryExists = await _context.Category.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
            {
                return new ApiResponse<GetProductDTO>(null, null, "400", "Category not exist", false, 0, 0, 0, 0, null, null, null);
            }
            string? imageUrl = null;

            if (image != null)
            {
                var ext = Path.GetExtension(image.FileName).ToLower();
                var allowExt = new[] { ".png", ".jpg", ".jpeg", ".webp" };

                if (!allowExt.Contains(ext))
                    return new ApiResponse<GetProductDTO>(null, null, "400", "Image is invalid", false, 0, 0, 0, 0, null, null, null);

                var folderPath = Path.Combine(
                    _env.WebRootPath,
                    "images",
                    "products"
                );

                Directory.CreateDirectory(folderPath);

                var fileName = $"{Guid.NewGuid()}{ext}";
                var fullPath = Path.Combine(folderPath, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await image.CopyToAsync(stream);

                imageUrl = $"/images/products/{fileName}";
            }
            var product = new Product
            {
                Id = Guid.NewGuid(),
                ProductName = dto.ProductName,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                CategoryId = dto.CategoryId,
                ImageUrl = imageUrl,
                Status = 1,
                CreatedDate = DateTime.UtcNow
            };

            await  _context.Product.AddAsync(product);
            GetProductDTO getProductDTO = new GetProductDTO
            {
                Id = product.Id,
                ProductName = product.ProductName,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                CategoryName = (await _context.Category.FindAsync(product.CategoryId))!.CategoryName,
                ImageUrl = product.ImageUrl
            };
            await _context.SaveChangesAsync();
            return new ApiResponse<GetProductDTO>(null, getProductDTO, "200", "Create product successfully", true, 0, 0, 0, 0, null, null, null);

        }

        public async Task<ApiResponse<GetProductDTO>> DeleteProductAsync(Guid id)
        {
            var find = await _context.Product.FindAsync(id);
            if (find == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "404", "Product not found", false, 0, 0, 0, 0, null, null, null);
            }
            find.Status = 0;
            if (!string.IsNullOrEmpty(find.ImageUrl))
            {
                var oldImagePath = Path.Combine(
                    _env.WebRootPath,
                    find.ImageUrl.TrimStart('/')
                );

                if (File.Exists(oldImagePath))
                    File.Delete(oldImagePath);
            }
            await _context.SaveChangesAsync();
            return new ApiResponse<GetProductDTO>(null, null, "200", "Delete product successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> GetAllProductAsync()
        {
            var products = await _context.Product
                .Where(p => p.Status == 1)
                .Include(p => p.Category)
                .Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl
                })
                .ToListAsync();
            return new ApiResponse<GetProductDTO>(products, null, "200", "Get all products successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> GetProductByCategoryIdAsync(Guid categoryId)
        {
            var  findCategory = await _context.Category.FindAsync(categoryId);
            if (findCategory == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "404", "Category not found", false, 0, 0, 0, 0, null, null, null);
            }
            var products = await _context.Product
                .Where(p => p.CategoryId == categoryId && p.Status == 1)
                .Include(p => p.Category)
                .Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl
                })
                .ToListAsync();
            return new ApiResponse<GetProductDTO>(products, null, "200", "Get products by category successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> GetProductByIdAsync(Guid id)
        {
            var find = await _context.Product
                .Where(p => p.Id == id && p.Status == 1)
                .Include(p => p.Category)
                .Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl
                })
                .FirstOrDefaultAsync(); 
            if(find == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "404", "Product not found", false, 0, 0, 0, 0, null, null, null);
            }
            return new ApiResponse<GetProductDTO>(null, find, "200", "Get product by id successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> UpdateProductAsync(Guid id, ProductDTO product,IFormFile? newImage)
        {
            var findProduct = await _context.Product.FindAsync(id);
            if (findProduct == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "404", "Product not found", false, 0, 0, 0, 0, null, null, null);
            }
            findProduct.ProductName = product.ProductName;
            findProduct.Description = product.Description;
            findProduct.Price = product.Price;
            findProduct.Stock = product.Stock;
            findProduct.CategoryId = product.CategoryId;
            if (newImage != null)
            {
                var ext = Path.GetExtension(newImage.FileName).ToLower();
                var allowExt = new[] { ".png", ".jpg", ".jpeg", ".webp" };
                if (!allowExt.Contains(ext))
                    return new ApiResponse<GetProductDTO>(null, null, "400", "Image is invaid", false, 0, 0, 0, 0, null, null, null);
                var folderPath = Path.Combine(
                    _env.WebRootPath,
                    "images",
                    "products"

                );
                if (!string.IsNullOrEmpty(findProduct.ImageUrl))
                {
                    var oldImagePath = Path.Combine(
                        _env.WebRootPath,
                        findProduct.ImageUrl.TrimStart('/')
                    );

                    if (File.Exists(oldImagePath))
                        File.Delete(oldImagePath);
                }
                Directory.CreateDirectory(folderPath);
                var fileName = $"{Guid.NewGuid()}{ext}";
                var fullPath = Path.Combine(folderPath, fileName);
                using var stream = new FileStream(fullPath, FileMode.Create);
                await newImage.CopyToAsync(stream);
                findProduct.ImageUrl = $"/images/products/{fileName}";
                
            }
            await _context.SaveChangesAsync();
            var name = await _context.Category.FirstOrDefaultAsync(c => c.Id == findProduct.CategoryId);
            var updatedProductWithImage = new GetProductDTO
            {
                Id = findProduct.Id,
                ProductName = findProduct.ProductName,
                Description = findProduct.Description,
                Price = findProduct.Price,
                Stock = findProduct.Stock,
                CategoryName = name.CategoryName,
                ImageUrl = findProduct.ImageUrl
            };
            return new ApiResponse<GetProductDTO>(null, updatedProductWithImage, "200", "Update product successfully with new image", true, 0, 0, 0, 0, null, null, null);

        }
    }
}
