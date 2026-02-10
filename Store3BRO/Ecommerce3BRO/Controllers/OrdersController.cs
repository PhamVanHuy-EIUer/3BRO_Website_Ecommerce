using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : Controller
    {
        private readonly IOrderRepository _orderRepository;
        public OrdersController(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        //Api get all orders by admin
        [HttpGet("admin")]
        [Authorize(Roles ="Admin")]
        public async Task<ApiResponse<GetOrderByAdminDTO>> GetAllOrdersByAdmin()
        {
            return await _orderRepository.GetAllOrderByAdminAsync();
        }

        //Api get all orders by user
        [HttpGet("user")]
        [Authorize]
        public async Task<ApiResponse<UserOrderDTO>> GetAllOrdersByUser()
        {
            var findUser = User.FindFirst(ClaimTypes.NameIdentifier);
            if (findUser == null)
            {
                return new ApiResponse<UserOrderDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var userId = Guid.Parse(findUser.Value);
            return await _orderRepository.GetAllOrderByUserAsync(userId);
        }

        //Api add new order with items
        [HttpPost("add-order")]
        [Authorize]
        public async Task<ApiResponse<GetOrderDTO>> AddNewOrderWithItems([FromBody] OrderDTO order)
        {
            var findUser = User.FindFirst(ClaimTypes.NameIdentifier);
            if (findUser == null)
            {
                return new ApiResponse<GetOrderDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var userId = Guid.Parse(findUser.Value);
            return await _orderRepository.AddNewOrderWithItemsAsync(userId, order);
        }

        //Api remove order 
        [HttpDelete("remove-order/{orderId}")]
        [Authorize(Roles ="User")]
        public async Task<ApiResponse<Order>> RemoveOrder([FromRoute] Guid orderId)
        {
            return await _orderRepository.RemoveOrderAsync(orderId);
        }

        //api admin use to get order by status
        [HttpGet("by-status")]
        [Authorize(Roles ="Admin")]
        public async Task<ApiResponse<GetOrderByAdminDTO>> GetOrderByStatus([FromQuery] string status)
        {
            return await _orderRepository.GetOrderByStatus(status);

        }

        //api admin use to update order status
        [HttpPut("update-status/{orderId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<OrderDTO>> UpdateOrderStatus([FromRoute] Guid orderId, [FromQuery] int status)
        {
            return await _orderRepository.UpdateOrderStatus(orderId, status);
        }

        //Api get order detail by id
        [HttpGet("order-detail/{orderId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<ViewOrderDetailDTO>> GetOrderDetailById([FromRoute] Guid orderId)
        {
            return await _orderRepository.GetOrderDetailByIdAsync(orderId);
        }
    }
}
