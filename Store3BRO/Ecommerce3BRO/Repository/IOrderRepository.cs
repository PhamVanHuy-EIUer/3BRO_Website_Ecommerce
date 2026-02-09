using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IOrderRepository
    {
        public Task<ApiResponse<GetOrderDTO>> AddNewOrderWithItemsAsync(Guid userId, OrderDTO order);
        public Task<ApiResponse<Order>> RemoveOrderAsync(Guid orderId);
        public Task<ApiResponse<GetOrderByAdminDTO>> GetAllOrderByAdminAsync();
        public Task<ApiResponse<ViewOrderDetailDTO>> GetOrderDetailByIdAsync(Guid orderId);
        public Task<ApiResponse<UserOrderDTO>> GetAllOrderByUserAsync(Guid userId);
        public Task<ApiResponse<GetOrderByAdminDTO>> GetOrderByStatus(string status);
        public Task<ApiResponse<OrderDTO>> UpdateOrderStatus(Guid orderId, int status);

    }
}
