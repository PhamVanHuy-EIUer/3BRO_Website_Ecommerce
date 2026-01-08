using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : Controller
    {
        private readonly IProductRepository _productService;
        public ProductsController(IProductRepository productService)
        {
            _productService = productService;
        }

        //Api get all products
        [HttpGet]
        public async Task<ApiResponse<GetProductDTO>> GetAllProducts()
        {
            return await _productService.GetAllProductAsync();
        }
        //Api add new product
        [HttpPost]
        public async Task<ApiResponse<GetProductDTO>> AddNewProduct([FromForm] ProductDTO dto, IFormFile image)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetProductDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            return await _productService.AddNewProductAsync(dto, image);
        }

        //Api update product
        [HttpPut("{id}")]
        public async Task<ApiResponse<GetProductDTO>> UpdateProduct(Guid id, [FromForm] ProductDTO dto, IFormFile image)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetProductDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            return await _productService.UpdateProductAsync(id, dto, image);
        }

        //Api delete product
        [HttpDelete("{id}")]
        public async Task<ApiResponse<GetProductDTO>> DeleteProduct(Guid id)
        {
            return await _productService.DeleteProductAsync(id);
        }
        [HttpGet("{id}")]
        public async Task<ApiResponse<GetProductDTO>> GetProductById(Guid id)
        {
            return await _productService.GetProductByIdAsync(id);

        }

        //api get products by category id
        [HttpGet("by-category")]
        public async Task<ApiResponse<GetProductDTO>> GetProductByCategoryId([FromQuery] Guid categoryId)
        {
            return await _productService.GetProductByCategoryIdAsync(categoryId);
        }
        [HttpGet("search-product")]
        public async Task<ApiResponse<GetProductDTO>> SearchProducts([FromQuery] string keyword)
        {
            return await _productService.SearchProductsAsync(keyword);
        }
        [HttpGet("by-page")]
        public async Task<ApiResponse<GetProductDTO>> GetProductByPages([FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            return await _productService.GetProductByPages(currentPage, pageSize);
        }
        [HttpGet("order-product")]
        public async Task<ApiResponse<GetOrderProductDTO>> GetMostOrderedProductByPages([FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            return await _productService.GetMostOrderedProductByPages(currentPage, pageSize);
        }
    }
}
