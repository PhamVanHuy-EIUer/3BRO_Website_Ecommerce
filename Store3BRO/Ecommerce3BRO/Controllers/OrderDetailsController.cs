using Ecommerce3BRO.Model;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : Controller
    {
        private readonly IOrderDetailRepository _orderDetailService;
        public OrderDetailsController(IOrderDetailRepository orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }

        // api for user to delete item in their order ,just delete 1 type of product,can not delete 1 product
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ApiResponse<string>> DeleteItemInOrder([FromRoute] Guid id)
        {
            var result = await _orderDetailService.RemoveOrderDetailAsync(id);
            return result;
        }
    }
}
