using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface ICartRepository
    {
        Task AddNewCartAsync(Guid userId);
    }
}
