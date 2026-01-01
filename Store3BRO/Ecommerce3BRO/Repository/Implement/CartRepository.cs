using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository.Implement
{
    public class CartRepository : ICartRepository
    {
        private readonly Ecommerce3BROContext _context;
        public CartRepository(Ecommerce3BROContext context)
        {
            _context = context;
        }
        public async Task AddNewCartAsync(Guid userId)
        {
            Cart newCart = new Cart
            {
                UserId = userId,
                CreatedDate = DateTime.UtcNow,
                IsDeleted = false,
            };
            await _context.Cart.AddAsync(newCart);
            await _context.SaveChangesAsync();
        }
    }
}
