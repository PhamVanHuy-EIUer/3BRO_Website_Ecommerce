using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductImagesController : Controller
    {
        private readonly IProductImageRepository _productImageRepository;
        public ProductImagesController(IProductImageRepository productImageRepository)
        {
            _productImageRepository = productImageRepository;
        }


        [HttpPost("AddNewImageForProduct/{productId}")]
        public async Task<ApiResponse<GetProductImageDTO>> AddNewImageForProduct([FromRoute] Guid productId, IFormFile newImage)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetProductImageDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            return await _productImageRepository.AddNewImageForProductAsync(productId, newImage);
        }


        [HttpGet("all-imageProduct")]
        public async Task<ApiResponse<GetProductImageDTO>> GetAllImagesByProductId([FromQuery] Guid productId)
        {
            return await _productImageRepository.GetAllImagesByProductIdAsync(productId);
        }


        [HttpDelete("{imageId}")]
        public async Task<ApiResponse<GetProductImageDTO>> RemoveImageFromProduct([FromRoute] Guid imageId)
        {
            return await _productImageRepository.RemoveImageFromProductAsync(imageId);
        }

    }
}
