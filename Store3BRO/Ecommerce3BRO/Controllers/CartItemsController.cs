using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemsController : Controller
    {
        private readonly ICartItemRepository _cartItemService;
        public CartItemsController(ICartItemRepository cartItemService)
        {
            _cartItemService = cartItemService;
        }

        [Authorize]
        //Api add new item to cart
        [HttpPost("add")]
        public async Task<ApiResponse<CartItemDTO>> AddNewItemToCart([FromQuery] Guid productId, [FromQuery] int quantity)
        {
            var user = User.FindFirst(ClaimTypes.NameIdentifier);
            if (user == null)
            {
                return new ApiResponse<CartItemDTO>(null, null, "401", "Unauthorized", true, 0, 0, 0, 0, null, null, null);
            }
            var userId = Guid.Parse(user.Value);
            return await _cartItemService.AddNewItemToCartAsync(productId, userId, quantity);
        }
        [Authorize]
        //Api remove item from cart
        [HttpDelete]
        public async Task<ApiResponse<CartItemDTO>> RemoveItemFromCart([FromQuery] Guid productId)
        {

            var user = User.FindFirst(ClaimTypes.NameIdentifier);
            if (user == null)
            {
                return new ApiResponse<CartItemDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var userId = Guid.Parse(user.Value);
            return await _cartItemService.RemoveItemFromCartAsync(productId,userId);

        }
        [Authorize]
        //Api show item quantity in cart
        [HttpGet("quantity")]
        public async Task<ApiResponse<CartProductDTO>> GetItemQuantityInCart()
        {
            var user = User.FindFirst(ClaimTypes.NameIdentifier);
            if (user == null)
            {
                return new ApiResponse<CartProductDTO>(null, null, "401", "Unauthorize", true, 0, 0, 0, 0, null, null, null);
            }
            var userId = Guid.Parse(user.Value);
            return await _cartItemService.ShowItemsInCartAsync(userId);
        }
        [Authorize]
        [HttpPost("preview-price")]
        public async Task<ApiResponse<decimal>> getSeletedProductPrice([FromBody] List<CheckOutItemDTO> items)
        {
            
            return await _cartItemService.PreviewTotalPriceAsync(items);
        }
        [Authorize]
        [HttpDelete("delete-list-product")]
        public async Task<ApiResponse<string>> deleteListItems([FromBody] List<DeleteProductInCartDTO> listItems)
        {
            var user = User.FindFirst(ClaimTypes.NameIdentifier);
            if(user == null)
            {
                return new ApiResponse<string>(null, null, "401", "Unauthorize", true, 0, 0, 0, 0, null, null, null);
            }
            var userId = Guid.Parse(user.Value);
            return await _cartItemService.DeleteListProductsInCartAsync(listItems, userId);
        }
        
    }
}
