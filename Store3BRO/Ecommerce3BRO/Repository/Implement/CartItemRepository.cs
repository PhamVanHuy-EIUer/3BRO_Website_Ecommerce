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
        public async Task<ApiResponse<CartItemDTO>> AddNewItemToCartAsync( Guid productId, Guid userId,int quantity)
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

            if (product.Stock < quantity)
                return new ApiResponse<CartItemDTO>(null, null, "400", "Out of stock", false, 0, 0, 0, 0, null, null, null);

            var cartItem = await _context.CartItem
                .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductId == productId);

            if (cartItem != null)
            {
                cartItem.Quantity += quantity;
            }
            else
            {
                cartItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = productId,
                    Quantity = quantity,
                    Price = product.Price,
                    CreatedDate = DateTime.UtcNow
                };

                await _context.CartItem.AddAsync(cartItem);
            }

            await _context.SaveChangesAsync();

            return new ApiResponse<CartItemDTO>(null, null, "200", "Add item to cart successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<decimal>> PreviewTotalPriceAsync(List<CheckOutItemDTO> items)
        {
            decimal total = 0;

            foreach (var item in items)
            {
                var product = await _context.Product.FirstOrDefaultAsync(u => u.Id == item.ProductId);

                if(product == null)
                {
                    continue;
                }

                total += (product.Price * item.Quantity);

            }

            return new ApiResponse<decimal>(null, total, "200", "Get total price successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<CartItemDTO>> RemoveItemFromCartAsync(Guid productId, Guid userId)
        {
            var findCart = await _context.Cart.FirstOrDefaultAsync(c => c.UserId == userId);
            if (findCart == null)
            {
                return new ApiResponse<CartItemDTO>(null, null, "404", "Cart not found", false, 0, 0, 0, 0, null, null, null);
            }
            var findCartItem =await _context.CartItem.FirstOrDefaultAsync(ci => ci.CartId == findCart.Id && ci.ProductId == productId);
            if (findCartItem == null)
            {
                return new ApiResponse<CartItemDTO>(null, null, "404", "Cart item not found", false, 0, 0, 0, 0, null, null, null);
            }
            _context.CartItem.Remove(findCartItem);
            await _context.SaveChangesAsync();
            return new ApiResponse<CartItemDTO>(null, null, "200", "Remove item from cart successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<CartProductDTO>> ShowItemsInCartAsync(Guid userId)
        {
            var cart = await _context.Cart
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return new ApiResponse<CartProductDTO>(
                    null, null, "404", "Cart not found", false,
                    0, 0, 0, 0, null, null, null);
            }

            var productsInCart = await _context.CartItem
                .Where(ci => ci.CartId == cart.Id)
                .Include(ci => ci.Product)
                    .ThenInclude(p => p.Category)
                .Select(ci => new CartProductDTO
                {
                    ProductId = ci.Product.Id,
                    ProductName = ci.Product.ProductName,
                    Price = ci.Price,          
                    Quantity = ci.Quantity,    
                    CategoryName = ci.Product.Category.CategoryName,
                    ImageUrl = ci.Product.ImageUrl,
                    CartItemID = ci.Id
                })
                .ToListAsync();

            return new ApiResponse<CartProductDTO>(
                productsInCart, null, "200", "Show items in cart successfully", true,
                0, 0, 0, 0, null, null, null);
        }

    }
}
