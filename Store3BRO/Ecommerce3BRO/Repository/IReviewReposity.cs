using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IReviewReposity
    {
        Task<ApiResponse<GetReviewDTO>> GetAllReview();
        Task<ApiResponse<GetReviewDetailDTO>> GetReviewByIdAsync(Guid reviewId);
        Task<ApiResponse<GetReviewDTO>> UpdateReviewAsync(Guid reviewId, ReviewDTO review);
        Task<ApiResponse<ReviewDTO>> AddNewReviewAsync( Guid userId, ReviewDTO review);
        Task<ApiResponse<GetReviewDTO>> DeleteReviewAsync(Guid reviewId);
        Task<ApiResponse<GetReviewDTO>> GetReviewByPage(int currentPage, int pageSize);
        Task<ApiResponse<GetReviewDetailDTO>> GetReviewByUser(Guid userId);
    }
}
