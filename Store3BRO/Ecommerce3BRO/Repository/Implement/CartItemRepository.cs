using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

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

        public async Task<ApiResponse<CartProductDTO>> ChangeQuantityProductOfCartItem(Guid cartItemId,int quantity)
        {
            var findCartItem = await _context.CartItem.Include(ci=>ci.Product).ThenInclude(ci=>ci.Category).FirstOrDefaultAsync(ci=>ci.Id==cartItemId);
            if (quantity > findCartItem.Product.Stock)
            {
                return new ApiResponse<CartProductDTO>(null, null, "400", "Quantity product is out of stock", false, 0, 0, 0, 0, null, null, null);
            }
            if (findCartItem == null) {
                return new ApiResponse<CartProductDTO>(null, null, "404", "Cart Item not found", false, 0, 0, 0, 0, null, null, null);
            }
            findCartItem.Quantity = quantity;
            await _context.SaveChangesAsync();
            var dto = new CartProductDTO
            {
                ProductId = findCartItem.Product.Id,
                ProductName = findCartItem.Product.ProductName,
                Price = findCartItem.Price,
                Quantity = findCartItem.Quantity,
                CategoryName = findCartItem.Product.Category.CategoryName,
                ImageUrl = findCartItem.Product.ImageUrl,
                CartItemID = findCartItem.Id
            };
            return new ApiResponse<CartProductDTO>(null, dto, "200", "Change quantity of item successfully", false, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<string>> DeleteListProductsInCartAsync(List<DeleteProductInCartDTO> listProducts, Guid userId)
        {

            if(listProducts.Count == 0 || listProducts == null)
            {
                return new ApiResponse<string>(null, "Please login account", "401", "Unauthorized", false, 0, 0, 0, 0 , null, null, null);
            }

            var cart = await _context.Cart.FirstOrDefaultAsync(u => u.Id == userId);


            foreach (var item in listProducts)
            {
                var findCart = await _context.Cart.FirstOrDefaultAsync(c => c.UserId == userId);
                if (findCart == null)
                {
                    return new ApiResponse<string>(null, null, "404", "Cart user not found", false, 0, 0, 0, 0, null, null, null);
                }

                var findCartItem = await _context.CartItem.FirstOrDefaultAsync(ci => ci.CartId == findCart.Id && ci.ProductId == item.Id);
                if (findCartItem == null)
                {
                    continue;
                }
                _context.CartItem.Remove(findCartItem);
                
            }
            await _context.SaveChangesAsync();
            return new ApiResponse<string>(null, null, "200", "Remove item from cart successfully", true, 0, 0, 0, 0, null, null, null);
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
