using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using static System.Net.Mime.MediaTypeNames;

namespace Ecommerce3BRO.Repository.Implement
{
    public class ProductImageRepository : IProductImageRepository
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IWebHostEnvironment _env;
        public ProductImageRepository(Ecommerce3BROContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<ApiResponse<GetProductImageDTO>> AddNewImageForProductAsync(Guid productId, IFormFile newImage)
        {
            var findProduct = await _context.Product.FindAsync(productId);
            if(findProduct == null)
            {
                return new ApiResponse<GetProductImageDTO>(null, null, "404", "Product is not founded", false, 0, 0, 0, 0, null, null, null);
            }
            string? imageUrl = null;

            if (newImage != null)
            {
                var ext = Path.GetExtension(newImage.FileName).ToLower();
                var allowExt = new[] { ".png", ".jpg", ".jpeg", ".webp" };

                if (!allowExt.Contains(ext))
                    return new ApiResponse<GetProductImageDTO>(null, null, "400", "Image is invalid", false, 0, 0, 0, 0, null, null, null);

                var folderPath = Path.Combine(
                    _env.WebRootPath,
                    "images",
                    "products"
                );

                Directory.CreateDirectory(folderPath);

                var fileName = $"{Guid.NewGuid()}{ext}";
                var fullPath = Path.Combine(folderPath, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await newImage.CopyToAsync(stream);

                imageUrl = $"/images/products/{fileName}";
            }
            var productImage = new ProductImage
            {
                ProductId = productId,
                ImageUrl = imageUrl
            };
            await _context.ProductImage.AddAsync(productImage);
            await _context.SaveChangesAsync();
            var productImageDto = new GetProductImageDTO
            {
                Id = productImage.Id,
                ProductName = findProduct.ProductName,
                ImageUrl = productImage.ImageUrl
            };
            return new ApiResponse<GetProductImageDTO>(null, productImageDto, "200", "Add image to product successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetProductImageDTO>> GetAllImagesByProductIdAsync(Guid productId)
        {
            var findProduct =await _context.Product.FindAsync(productId);
            if (findProduct == null)
            {
                return new ApiResponse<GetProductImageDTO>(null, null, "404", "Product is not founded", false, 0, 0, 0, 0, null, null, null);
            }
            var productImageDTOs = _context.ProductImage
                .Where(pi => pi.ProductId == productId)
                .Select(pi => new GetProductImageDTO
                {
                    Id = pi.Id,
                    ProductName = findProduct.ProductName,
                    ImageUrl = pi.ImageUrl
                }).ToList();
            return new ApiResponse<GetProductImageDTO>(productImageDTOs, null, "200", "Get all images by product id successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetProductImageDTO>> RemoveImageFromProductAsync(Guid imageId)
        {
            var findImage = await _context.ProductImage.FindAsync(imageId);
            if (findImage == null)
            {
                return new ApiResponse<GetProductImageDTO>(
                    null, null, "404", "Image not found", false, 0, 0, 0, 0, null, null, null
                );
            }

            if (string.IsNullOrEmpty(_env.WebRootPath) || string.IsNullOrEmpty(findImage.ImageUrl))
            {
                return new ApiResponse<GetProductImageDTO>(
                    null, null, "500", "Invalid image path", false, 0, 0, 0, 0, null, null, null
                );
            }

            var oldImagePath = Path.Combine(
                _env.WebRootPath,
                findImage.ImageUrl.TrimStart('/')
            );

            try
            {
                if (File.Exists(oldImagePath))
                    File.Delete(oldImagePath);
            }
            catch (Exception ex)
            {
                return new ApiResponse<GetProductImageDTO>(
                    null, null, "500", $"Cannot delete image file: {ex.Message}", false, 0, 0, 0, 0, null, null, null
                );
            }

            _context.ProductImage.Remove(findImage);
            await _context.SaveChangesAsync();

            return new ApiResponse<GetProductImageDTO>(
                null, null, "200", "Remove image from product successfully", true, 0, 0, 0, 0, null, null, null
            );
        }

    }
}
