using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : Controller
    {
        private readonly IReviewRepository _reviewService;
        public ReviewsController(IReviewRepository reviewService)
        {
            _reviewService = reviewService;
        }
        [HttpPost]
        [Authorize]
        public async Task<ApiResponse<ReviewDTO>> AddNewReviewAsync([FromBody] ReviewDTO review)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<ReviewDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var findUser = User.FindFirst(ClaimTypes.NameIdentifier);
            if (findUser == null)
            {
                return new ApiResponse<ReviewDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var userId = Guid.Parse(findUser.Value);
            var result = await _reviewService.AddNewReviewAsync(userId,review);
            return result;
        }
        [HttpGet("by-user")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetReviewDetailDTO>> GetReviewByUserAsync()
        {
            var findUser = User.FindFirst(ClaimTypes.NameIdentifier);
            if (findUser == null)
            {
                return new ApiResponse<GetReviewDetailDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var userId = Guid.Parse(findUser.Value);
            var result = await _reviewService.GetReviewByUser(userId);
            return result;
        }
        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetReviewDTO>> DeleteReviewAsync([FromQuery] Guid reviewId)
        {
            var result = await _reviewService.DeleteReviewAsync(reviewId);
            return result;
        }
        [HttpPut]
        [Authorize(Roles ="User")]
        public async Task<ApiResponse<GetReviewDTO>> UpdateReviewAsync([FromQuery] Guid reviewId, [FromBody] ReviewDTO review)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetReviewDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var result = await _reviewService.UpdateReviewAsync(reviewId, review);
            return result;
        }
        [HttpGet("Detail")]
        [Authorize(Roles ="Admin")]
        public async Task<ApiResponse<GetReviewDetailDTO>> GetReviewDetailByIdAsync([FromQuery] Guid reviewId)
        {
            var result = await _reviewService.GetReviewByIdAsync(reviewId);
            return result;
        }
        [HttpGet("by-page")]
        public async Task<ApiResponse<GetReviewDTO>> GetReviewByPage([FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            return await _reviewService.GetReviewByPage(currentPage, pageSize);
        }

        [HttpGet("product-by-page{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetReviewDTO>> GetReviewByPage([FromRoute] Guid id,[FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            return await _reviewService.GetReviewByProduct(id,currentPage,pageSize);
        }
        [HttpGet("rating{productId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<RatingNumberDTO>> GetRatingByProduct([FromRoute] Guid productId)
        {
            return await _reviewService.GetRatingNumByProduct(productId);
        }
    }
}
