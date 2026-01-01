using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class CartItemRepository : ICartItemRepository
    {
        private readonly Ecommerce3BROContext _context;
        private readonly ICartRepository _cartService;
        public CartItemRepository(Ecommerce3BROContext context, ICartRepository cartService)
        {
            _context = context;
            _cartService = cartService;
        }
        public async Task<ApiResponse<CartItemDTO>> AddNewItemToCartAsync( Guid productId, Guid userId)
        {
            var cart = await _context.Cart.FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                await _cartService.AddNewCartAsync(userId);
                cart = await _context.Cart.FirstAsync(c => c.UserId == userId);
            }

            var product = await _context.Product
                .FirstOrDefaultAsync(p => p.Id == productId && p.Status == 1);

            if (product == null)
                return new ApiResponse<CartItemDTO>(null, null, "404", "Product not found", false, 0, 0, 0, 0, null, null, null);

            if (product.Stock <= 0)
                return new ApiResponse<CartItemDTO>(null, null, "400", "Out of stock", false, 0, 0, 0, 0, null, null, null);

            var cartItem = await _context.CartItem
                .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductId == productId);

            if (cartItem != null)
            {
                cartItem.Quantity += 1;
            }
            else
            {
                cartItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = productId,
                    Quantity = 1,
                    Price = product.Price,
                    CreatedDate = DateTime.UtcNow
                };

                await _context.CartItem.AddAsync(cartItem);
            }

            await _context.SaveChangesAsync();

            return new ApiResponse<CartItemDTO>(null, null, "200", "Add item to cart successfully", true, 0, 0, 0, 0, null, null, null);
        }


        public async Task<ApiResponse<CartItemDTO>> RemoveItemFromCartAsync(Guid productId, Guid userId)
        {
            var findCart = _context.Cart.FirstOrDefault(c => c.UserId == userId);
            if (findCart == null)
            {
                return new ApiResponse<CartItemDTO>(null, null, "404", "Cart not found", false, 0, 0, 0, 0, null, null, null);
            }
            var findCartItem = _context.CartItem.FirstOrDefault(ci => ci.CartId == findCart.Id && ci.ProductId == productId);
            if (findCartItem == null)
            {
                return new ApiResponse<CartItemDTO>(null, null, "404", "Cart item not found", false, 0, 0, 0, 0, null, null, null);
            }
            _context.CartItem.Remove(findCartItem);
            _context.SaveChanges();
            return new ApiResponse<CartItemDTO>(null, null, "200", "Remove item from cart successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> ShowItemsInCartAsync(Guid userId)
        {
            var findCart = _context.Cart.FirstOrDefault(c => c.UserId == userId);
            if (findCart == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "404", "Cart not found", false, 0, 0, 0, 0, null, null, null);
            }
            var cartItems = _context.CartItem.Where(ci => ci.CartId == findCart.Id).ToList();
            var productListInCart = await _context.CartItem.Where(ci => ci.CartId == findCart.Id).Include(ci => ci.Product)
            .Select(ci => new GetProductDTO
            {

                Id = ci.Product.Id,
                ProductName = ci.Product.ProductName,
                Description = ci.Product.Description,
                Price = ci.Product.Price,
                Stock = ci.Product.Stock,
                CategoryName = ci.Product.Category.CategoryName,
                ImageUrl = ci.Product.ImageUrl

            }).ToListAsync();
            return new ApiResponse<GetProductDTO>(productListInCart, null, "200", "Show items in cart successfully", true, 0, 0, 0, 0, null, null, null);
        }
    }
}
