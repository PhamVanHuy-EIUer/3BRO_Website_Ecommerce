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


        // api use to get all discounts 
        [HttpGet]
        public Task<ApiResponse<GetDiscountDTO>> GetAllDiscounts()
        {
            return _discountRepository.GetAllDiscountAsync();
        }

        //api use to add new discount
        [HttpPost]
        public async Task<ApiResponse<GetDiscountDTO>> AddNewDiscount([FromBody] DiscountDTO discountDTO)
        {
            return await _discountRepository.AddNewDiscountAsync(discountDTO);
        }

        // api use to get discount by id
        [HttpGet("{id}")]
        public async Task<ApiResponse<GetDiscountDTO>> GetDiscountById(Guid id)
        {
            return await _discountRepository.GetDiscountByIdAsync(id);
        }

        // api use to update discount
        [HttpPut]
        public async Task<ApiResponse<GetDiscountDTO>> UpdateDiscount(Guid id, [FromBody] DiscountDTO discountDTO)
        {
            return await _discountRepository.UpdateDiscountAsync(id, discountDTO);
        }

        // api use to delete discount
        [HttpDelete("{id}")]
        public async Task<ApiResponse<GetDiscountDTO>> DeleteDiscount(Guid id)
        {
            return await _discountRepository.DeleteDiscountAsync(id);
        }
    }
}
