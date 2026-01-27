using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using System.Net.WebSockets;

namespace Ecommerce3BRO.Repository.Implement
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly Ecommerce3BROContext _context;
        public ReviewRepository(Ecommerce3BROContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<ReviewDTO>> AddNewReviewAsync(Guid userId, ReviewDTO review)
        {
            var newReivew = new Review
            {
                UserId = userId,
                ProductId = review.ProductId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedDate = DateTime.UtcNow,
            };
            await _context.Review.AddAsync(newReivew);
            await _context.SaveChangesAsync();
            return new ApiResponse<ReviewDTO>(null, review, "200", "Add new review successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetReviewDTO>> DeleteReviewAsync(Guid reviewId)
        {
            var findReview = await _context.Review.FindAsync(reviewId);
            if (findReview == null)
            {
                return new ApiResponse<GetReviewDTO>(null, null, "404", "Review not found", false, 0, 0, 0, 0, null, null, null);
            }
            findReview.IsDeleted = true;
            await _context.SaveChangesAsync();
            return new ApiResponse<GetReviewDTO>(null, null, "200", "Delete review successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<RatingNumberDTO>> GetRatingNumByProduct(Guid productId)
        {
            var ratings = await _context.Review
                .Where(r => r.ProductId == productId)
                .GroupBy(r => r.Rating)
                .Select(g => new
                {
                    Rating = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var dto = new RatingNumberDTO
            {
                Rating1 = ratings.FirstOrDefault(x => x.Rating == 1)?.Count ?? 0,
                Rating2 = ratings.FirstOrDefault(x => x.Rating == 2)?.Count ?? 0,
                Rating3 = ratings.FirstOrDefault(x => x.Rating == 3)?.Count ?? 0,
                Rating4 = ratings.FirstOrDefault(x => x.Rating == 4)?.Count ?? 0,
                Rating5 = ratings.FirstOrDefault(x => x.Rating == 5)?.Count ?? 0,
            };

            return new ApiResponse<RatingNumberDTO>(
                null,
                dto,
                "200",
                "Get rating numbers successfully",
                true,
                0, 0, 0, 0,
                null, null, null
            );
        }


        public async Task<ApiResponse<GetReviewDetailDTO>> GetReviewByIdAsync(Guid reviewId)
        {
            var review = await _context.Review.FindAsync(reviewId);
            if (review == null || review.IsDeleted)
            {
                return new ApiResponse<GetReviewDetailDTO>(null, null, "404", "Review not found", false, 0, 0, 0, 0, null, null, null);
            }
            var reviewDetail = await _context.Review.Where(r => r.Id == reviewId)
                .Include(r => r.User)
                .Include(r => r.Product)
                .Select(r => new GetReviewDetailDTO
                {
                    ReviewName = r.User.FullName,
                    PhoneNumber = r.User.Phone,
                    Rating = r.Rating,
                    ProductName = r.Product.ProductName,
                    Comment = r.Comment,
                    ReviewDate = r.CreatedDate
                }).FirstOrDefaultAsync();
            return new ApiResponse<GetReviewDetailDTO>(null, reviewDetail, "200", "Get review detail successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetReviewDTO>> GetReviewByPage(int currentPage, int pageSize)
        {
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;
            var totalItems = _context.Review.Where(r => r.IsDeleted == false).Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var reviews = await _context.Review.Where(r => !r.IsDeleted).Include(r => r.User).Include(r => r.Product)
                .OrderByDescending(r => r.CreatedDate).Skip((currentPage - 1) * pageSize).Take(pageSize)
                .Select(r => new GetReviewDTO
                {
                    ReviewId = r.Id,
                    ReviewName = r.User.FullName,
                    PhoneNumber = r.User.Phone,
                    Rating = r.Rating,
                    ProductName = r.Product.ProductName,
                    ReviewDate = r.CreatedDate
                }).ToListAsync();
            return new ApiResponse<GetReviewDTO>(reviews, null, "200", "Get reviews by page successfully", true, currentPage, pageSize, totalPages, totalItems, null, null, null);
        }

        public async Task<ApiResponse<GetReviewDTO>> GetReviewByProduct(Guid productId,int currentPage,int pageSize)
        {
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;
            var totalItems = _context.Review.Where(r => r.IsDeleted == false).Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var reviews = await _context.Review.Include(p => p.User).Include(p => p.Product).Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.Rating).Skip((currentPage - 1) * pageSize).Take(pageSize)
                .Select(r => new GetReviewDTO()
                {
                    ReviewId = r.Id,
                    Rating = r.Rating,
                    PhoneNumber = r.User.Phone,
                    ProductName = r.Product.ProductName,
                    ReviewDate = r.CreatedDate,
                    ReviewName = r.User.FullName
                }).ToListAsync();
            return new ApiResponse<GetReviewDTO>(reviews, null, "200", "Get reviews of product by page successfully", true, currentPage, pageSize, totalPages, totalItems, null, null, null);
        }

        public async Task<ApiResponse<GetReviewDetailDTO>> GetReviewByUser(Guid userId)
        {
            var reviews = await _context.Review.Where(r => r.UserId == userId && !r.IsDeleted)
                 .Include(r => r.User)
                 .Include(r => r.Product)
                 .Select(r => new GetReviewDetailDTO
                 {
                     ReviewName = r.User.FullName,
                     PhoneNumber = r.User.Phone,
                     Rating = r.Rating,
                     ProductName = r.Product.ProductName,
                     Comment = r.Comment,
                     ReviewDate = r.CreatedDate
                 }).ToListAsync();
            return new ApiResponse<GetReviewDetailDTO>(reviews, null, "200", "Get reviews by user successfully", true, 0, 0, 0, reviews.Count, null, null, null);
        }

        public async Task<ApiResponse<GetReviewDTO>> UpdateReviewAsync(Guid reviewId, ReviewDTO review)
        {
            var findReview = await _context.Review.FindAsync(reviewId);
            if (findReview == null || findReview.IsDeleted)
            {
                return new ApiResponse<GetReviewDTO>(null, null, "404", "Review not found", false, 0, 0, 0, 0, null, null, null);
            }
            findReview.Rating = review.Rating;
            findReview.Comment = review.Comment;
            await _context.SaveChangesAsync();
            var updateReview = await _context.Review.Where(r => r.Id == reviewId)
            .Select(r => new GetReviewDTO
            {
                ReviewId = r.Id,
                ReviewName = r.User.FullName,
                PhoneNumber = r.User.Phone,
                Rating = r.Rating,
                ProductName = r.Product.ProductName,
                ReviewDate = r.CreatedDate
            }).FirstOrDefaultAsync();

            return new ApiResponse<GetReviewDTO>(null, updateReview, "200", "Update review successfully", true, 0, 0, 0, 0, null, null, null);

        }
    }
}
