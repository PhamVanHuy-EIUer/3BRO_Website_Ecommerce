using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IReviewRepository
    {
       
        Task<ApiResponse<GetReviewDetailDTO>> GetReviewByIdAsync(Guid reviewId);
        Task<ApiResponse<GetReviewDTO>> UpdateReviewAsync(Guid reviewId, ReviewDTO review);
        Task<ApiResponse<ReviewDTO>> AddNewReviewAsync( Guid userId, ReviewDTO review);
        Task<ApiResponse<GetReviewDTO>> DeleteReviewAsync(Guid reviewId);
        Task<ApiResponse<GetReviewDTO>> GetReviewByPage(int currentPage, int pageSize);
        Task<ApiResponse<GetReviewDTO>> GetReviewByUser(Guid userId, int currentPage, int pageSize);
        Task<ApiResponse<GetReviewDTO>> GetReviewByProduct(Guid productId, int currentPage, int pageSize);
        Task<ApiResponse<RatingNumberDTO>> GetRatingNumByProduct(Guid productId);
    }
}
