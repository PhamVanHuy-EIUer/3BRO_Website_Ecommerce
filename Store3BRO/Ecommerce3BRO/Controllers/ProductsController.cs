using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : Controller
    {
        private readonly IProductRepository _productService;
        private readonly Ecommerce3BROContext _context;
        public ProductsController(IProductRepository productService, Ecommerce3BROContext context)
        {
            _productService = productService;
            _context = context;
        }

        //Api get all products
        [HttpGet("get-available-products")]
        public async Task<ApiResponse<GetProductDTO>> GetAvailableProducts()
        {
            return await _productService.GetAvailableProductsAsync();
        }
        //Api add new product
        [HttpPost]
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetProductDTO>> UpdateProduct(Guid id, [FromForm] ProductDTO dto, IFormFile? image)
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
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetProductDTO>> DeleteProduct(Guid id)
        {
            return await _productService.DeleteProductAsync(id);
        }

        //Api get product by id
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

        //api search products
        [HttpGet("search-product")]
        public async Task<ApiResponse<GetProductDTO>> SearchProducts([FromQuery] string keyword, [FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            return await _productService.SearchProductByPageAsync(keyword, currentPage, pageSize);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("all-products-by-page")]
        public async Task<ApiResponse<GetProductByAdminDTO>> GetAllProductsAdminByPage([FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            return await _productService.GetAllProductByPageAsync(currentPage, pageSize);
        }
        //api get products by page
        [HttpGet("by-page")]
        public async Task<ApiResponse<GetProductDTO>> GetProductByPages([FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            return await _productService.GetProductByPages(currentPage, pageSize);
        }

        //api get most ordered product by page
        [HttpGet("order-product")]
        public async Task<ApiResponse<GetOrderProductDTO>> GetMostOrderedProductByPages([FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            return await _productService.GetMostOrderedProductByPages(currentPage, pageSize);
        }

        //api get products by category by page
        [HttpGet("category-pages")]
        public async Task<ApiResponse<GetProductDTO>> GetProductByCategoryByPageAsync([FromQuery] Guid categoryId, [FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            return await _productService.GetProductByCategoryByPageAsync(categoryId, currentPage, pageSize);
        }

        //api get products with auto discount when user checkout on 1 product in web
        [HttpGet("product-autodisccount-directly")]
        [Authorize]
        public async Task<ApiResponse<ShowCheckoutDTO>> GetProductsWithAutoDiscountByIdAsync([FromQuery] Guid productId, [FromQuery] int quantity)
        {
            var findUser = User.FindFirst(ClaimTypes.NameIdentifier);
            if (findUser == null)
            {
                return new ApiResponse<ShowCheckoutDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var userId = Guid.Parse(findUser.Value);
            return await _productService.GetProductWithAutoDiscountById(productId, quantity, userId);
        }

        //api get products with discount code when user checkout on 1 product in web
        [HttpGet("product-disccount-directly")]
        [Authorize]
        public async Task<ApiResponse<ShowCheckoutDTO>> GetProductsWithDiscountById([FromQuery] Guid productId, [FromQuery] int quantity, [FromQuery] string discountCode)
        {
            var findUser = User.FindFirst(ClaimTypes.NameIdentifier);
            if (findUser == null)
            {
                return new ApiResponse<ShowCheckoutDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var userId = Guid.Parse(findUser.Value);
            return await _productService.GetProductWithDiscountById(productId, quantity, userId, discountCode);
        }

        //api get products with discount code when user checkout on 1 product in cart
        [HttpPost("product-discount-cartitem")]
        [Authorize]
        public async Task<ApiResponse<ShowCheckoutDTO>> GetProductsWithDiscountByCartItemId([FromBody] CheckoutCartItemRequestDTO request)
        {
            var findUser = User.FindFirst(ClaimTypes.NameIdentifier);
            if (findUser == null || !Guid.TryParse(findUser.Value, out var userId))
            {
                return new ApiResponse<ShowCheckoutDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }

            return await _productService.GetProductWithDiscountByCartItemId(
                request,
                userId
                
            );
        }
    
        //api get products by price range
        [HttpGet("price-range")]
        public async Task<ApiResponse<GetProductDTO>> GetProductByPriceRange([FromQuery] decimal minPrice, [FromQuery] decimal maxPrice)
        {
            return await _productService.GetProductByPriceRange(minPrice, maxPrice);
        }
        [HttpGet("ascending-cost")]
        
        public async Task<ApiResponse<GetProductDTO>> GetProductByAscendingPrice()
        {
            return await _productService.GetProductByAscendingPrice();
        }

        [HttpGet("top-product-revenue")]
        public async Task<ApiResponse<TopProductDTO>> GetTopProducts([FromQuery]int pageSize)
        {
            return await _productService.GetTopProducts(pageSize);
        }

        //api update product status
        [HttpPut("status{productId}")]
        [Authorize(Roles ="Admin")]
        public async Task<ApiResponse<GetProductDTO>> UpdateProductStatus([FromRoute] Guid productId, [FromQuery] int status)
        {
            return await _productService.UpdateProductStatus(productId, status);
        }
        [HttpPost("item-list")]
        [Authorize]
        public async Task<ApiResponse<ShowCheckoutDTO>> GetProductWithAutoDiscountByCartIemList([FromQuery]List<Guid> cartItemId)
        {
            var findUser = User.FindFirst(ClaimTypes.NameIdentifier);
            if (findUser == null)
            {
                return new ApiResponse<ShowCheckoutDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var userId = Guid.Parse(findUser.Value);
            return await _productService.GetProductWithAutoDiscountByCartItemListId(cartItemId,userId);
        }
    }
}
