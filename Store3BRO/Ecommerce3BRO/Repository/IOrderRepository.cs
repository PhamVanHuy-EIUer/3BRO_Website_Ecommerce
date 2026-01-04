using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IOrderRepository
    {
        public Task<ApiResponse<OrderDTO>> AddNewOrderWithItemsAsync(Guid userId, OrderDTO order);
        public Task<ApiResponse<Order>> RemoveOrderAsync(Guid orderId);
        public Task<ApiResponse<GetOrderByAdminDTO>> GetAllOrderByAdminAsync();
        public Task<ApiResponse<UserOrderItem>> GetAllOrderByUserAsync(Guid userId);
        public Task<ApiResponse<GetOrderByAdminDTO>> GetOrderByStatus(string status);

    }
}
