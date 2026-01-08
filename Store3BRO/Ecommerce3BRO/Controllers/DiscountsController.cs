using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountsController : Controller
    {
        private readonly IDiscountRepository _discountRepository;
        public DiscountsController(IDiscountRepository discountRepository)
        {
            _discountRepository = discountRepository;
        }

        [HttpGet]
        public Task<ApiResponse<GetDiscountDTO>> GetAllDiscounts()
        {
            return _discountRepository.GetAllDiscountAsycn();
        }
        [HttpPost]
        public async Task<ApiResponse<GetDiscountDTO>> AddNewDiscount([FromBody] DiscountDTO discountDTO)
        {
            return await _discountRepository.AddNewDiscountAsync(discountDTO);
        }
        [HttpGet("{id}")]
        public async Task<ApiResponse<GetDiscountDTO>> GetDiscountById(Guid id)
        {
            return await _discountRepository.GetDiscountByIdAsync(id);
        }
        [HttpPut]
        public async Task<ApiResponse<GetDiscountDTO>> UpdateDiscount(Guid id, [FromBody] DiscountDTO discountDTO)
        {
            return await _discountRepository.UpdateDiscountAsync(id, discountDTO);
        }
        [HttpDelete("{id}")]
        public async Task<ApiResponse<GetDiscountDTO>> DeleteDiscount(Guid id)
        {
            return await _discountRepository.DeleteDiscountAsync(id);
        }
    }
}
