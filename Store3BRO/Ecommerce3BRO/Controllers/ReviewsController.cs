using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : Controller
    {
        private readonly IReviewReposity _reviewService;
        public ReviewsController(IReviewReposity reviewService)
        {
            _reviewService = reviewService;
        }
        [HttpGet]
        public async Task<ApiResponse<GetReviewDTO>> GetAllReview()
        {
            var result = await _reviewService.GetAllReview();
            return result;
        }
        [HttpPost]
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
        public async Task<ApiResponse<GetReviewDetailDTO>> GetReviewByIdAsync()
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
        public async Task<ApiResponse<GetReviewDTO>> DeleteReviewAsync([FromQuery] Guid reviewId)
        {
            var result = await _reviewService.DeleteReviewAsync(reviewId);
            return result;
        }
        [HttpPut]
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
        public async Task<ApiResponse<GetReviewDetailDTO>> GetReviewDetailByProductIdAsync([FromQuery] Guid reviewId)
        {
            var result = await _reviewService.GetReviewByIdAsync(reviewId);
            return result;
        }
    }
}
