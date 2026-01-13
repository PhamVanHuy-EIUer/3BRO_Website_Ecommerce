using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class DiscountRepository : IDiscountRepository
    {
        private readonly Ecommerce3BROContext _context;
        public DiscountRepository(Ecommerce3BROContext context)
        {
            _context = context;
        }
     
        public async Task<ApiResponse<GetDiscountDTO>> AddNewDiscountAsync(DiscountDTO discountDTO)
        {
            discountDTO.StartDate = DateTime.SpecifyKind(discountDTO.StartDate, DateTimeKind.Utc);
            discountDTO.ExpiredDate = DateTime.SpecifyKind(discountDTO.ExpiredDate, DateTimeKind.Utc);
            if ((discountDTO.DiscountAmount != null && discountDTO.DiscountPercent != null) || (discountDTO.DiscountAmount == null && discountDTO.DiscountPercent == null))
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "400", "Must set exactly one discount type (amount or percent)", false, 0, 0, 0, 0, null, null, null);
            }

            if (discountDTO.DiscountPercent.HasValue && (discountDTO.DiscountPercent <= 0 || discountDTO.DiscountPercent > 100))
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "400", "Discount percent must be between 1 and 100", false, 0, 0, 0, 0, null, null, null);
            }

            if (discountDTO.DiscountAmount.HasValue && discountDTO.DiscountAmount <= 0)
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "400", "Discount amount must be greater than 0", false, 0, 0, 0, 0, null, null, null);
            }
            if (discountDTO.StartDate <= DateTime.UtcNow)
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "400", "Start date must be in the future", false, 0, 0, 0, 0, null, null, null);
            }

            if (discountDTO.ExpiredDate <= discountDTO.StartDate)
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "400", "Expired date must be after start date", false, 0, 0, 0, 0, null, null, null);
            }
            var code = discountDTO.Code.Trim().ToUpper();

            var existingDiscount = await _context.Discount
                .FirstOrDefaultAsync(d => d.Code.ToUpper() == code);

            if (existingDiscount != null)
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "400", "Discount code already exists", false, 0, 0, 0, 0, null, null, null);
            }
            var newDiscount = new Discount
            {
                Code = code,
                Description = discountDTO.Description,
                DiscountAmount = discountDTO.DiscountAmount,
                DiscountPercent = discountDTO.DiscountPercent,
                MinOrderAmount = discountDTO.MinOrderAmount,
                Quantity = discountDTO.Quantity,
                StartDate = discountDTO.StartDate,
                EndDate = discountDTO.ExpiredDate,
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            };

            await _context.Discount.AddAsync(newDiscount);
            await _context.SaveChangesAsync();
            var result = new GetDiscountDTO
            {
                Id = newDiscount.Id,
                Code = newDiscount.Code,
                Description = newDiscount.Description,
                DiscountAmount = newDiscount.DiscountAmount,
                DiscountPercent = newDiscount.DiscountPercent,
                MinOrderAmount = newDiscount.MinOrderAmount,
                Quantity = newDiscount.Quantity,
                StartDate = newDiscount.StartDate,
                EndDate = newDiscount.EndDate,
                CreatedDate = newDiscount.CreatedDate,
                IsActive = newDiscount.IsActive
            };

            return new ApiResponse<GetDiscountDTO>(null, result, "201", "Create discount successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task ApplyDiscountToOrder(Guid orderId, Guid discount)
        {
            var newOrderDiscount = new OrderDiscount
            {
                OrderId = orderId,
                AssignedDate = DateTime.UtcNow,
                CreatedDate = DateTime.UtcNow,
                DiscountId = discount,
                IsUsed = true,
            };
            await _context.OrderDiscount.AddAsync(newOrderDiscount);
            await _context.SaveChangesAsync();
        }

        public async Task<ApiResponse<GetDiscountDTO>> DeleteDiscountAsync(Guid id)
        {
            var discount = _context.Discount.FirstOrDefault(d => d.Id == id);
            if (discount == null)
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "404", "Discount not found", false, 0, 0, 0, 0, null, null, null);
            }
            discount.IsActive = false;
            await _context.SaveChangesAsync();
            return new ApiResponse<GetDiscountDTO>(null, null, "200", "Delete discount successfully", true, 0, 0, 0, 0, null, null, null);

        }

        public async Task<ApiResponse<GetDiscountDTO>> GetAllDiscountAsync()
        {
            var discounts = _context.Discount.Select(discount => new GetDiscountDTO()
            {
                Id = discount.Id,
                Code = discount.Code,
                CreatedDate = discount.CreatedDate,
                Description = discount.Description,
                DiscountAmount = discount.DiscountAmount,
                DiscountPercent = discount.DiscountPercent,
                EndDate = discount.EndDate,
                MinOrderAmount = discount.MinOrderAmount,
                Quantity = discount.Quantity,
                StartDate = discount.StartDate,
                IsActive = discount.IsActive
            }).ToList();
            return new ApiResponse<GetDiscountDTO>(discounts, null, "200", "Get all discounts successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetDiscountDTO>> GetDiscountByIdAsync(Guid id)
        {
            var discount = _context.Discount.FirstOrDefault(d => d.Id == id);
            if (discount == null)
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "404", "Discount not found", false, 0, 0, 0, 0, null, null, null);
            }
            var discountDTO = new GetDiscountDTO()
            {
                Id = discount.Id,
                Code = discount.Code,
                CreatedDate = discount.CreatedDate,
                Description = discount.Description,
                DiscountAmount = discount.DiscountAmount,
                DiscountPercent = discount.DiscountPercent,
                EndDate = discount.EndDate, 
                MinOrderAmount = discount.MinOrderAmount,
                Quantity = discount.Quantity,
                StartDate = discount.StartDate, 
                IsActive = discount.IsActive
            };
            return new ApiResponse<GetDiscountDTO>(null, discountDTO, "200", "Get discount successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public Task<List<GetDiscountDTO>> GetDiscountByUser(decimal price)
        {
            var findDiscount = _context.Discount
                .Where(d => d.IsActive == true && d.StartDate <= DateTime.UtcNow && d.EndDate >= DateTime.UtcNow && d.MinOrderAmount <= price)
                .Select(discount => new GetDiscountDTO()
                {
                    Id = discount.Id,
                    Code = discount.Code,
                    CreatedDate = discount.CreatedDate,
                    Description = discount.Description,
                    DiscountAmount = discount.DiscountAmount,
                    DiscountPercent = discount.DiscountPercent,
                    EndDate = discount.EndDate,
                    MinOrderAmount = discount.MinOrderAmount,
                    Quantity = discount.Quantity,
                    StartDate = discount.StartDate,
                    IsActive = discount.IsActive
                }).ToListAsync();
            return findDiscount;
        }

        public async Task<ApiResponse<GetDiscountDTO>> UpdateDiscountAsync(Guid id, DiscountDTO discountDTO)
        {
            discountDTO.StartDate = DateTime.SpecifyKind(discountDTO.StartDate, DateTimeKind.Utc);
            discountDTO.ExpiredDate = DateTime.SpecifyKind(discountDTO.ExpiredDate, DateTimeKind.Utc);
            if ((discountDTO.DiscountAmount != null && discountDTO.DiscountPercent != null) || (discountDTO.DiscountAmount == null && discountDTO.DiscountPercent == null))
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "400", "Must set exactly one discount type (amount or percent)", false, 0, 0, 0, 0, null, null, null);
            }

            if (discountDTO.DiscountPercent.HasValue && (discountDTO.DiscountPercent <= 0 || discountDTO.DiscountPercent > 100))
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "400", "Discount percent must be between 1 and 100", false, 0, 0, 0, 0, null, null, null);
            }

            if (discountDTO.DiscountAmount.HasValue && discountDTO.DiscountAmount <= 0)
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "400", "Discount amount must be greater than 0", false, 0, 0, 0, 0, null, null, null);
            }
          
            if (discountDTO.ExpiredDate<=discountDTO.StartDate)
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "400", "Expired date must be after start date", false, 0, 0, 0, 0, null, null, null);
            }
            var findDiscount = await _context.Discount.FirstOrDefaultAsync(d => d.Id == id);
            if (findDiscount == null)
            {
                return new ApiResponse<GetDiscountDTO>(null, null, "404", "Discount not found", false, 0, 0, 0, 0, null, null, null);
            }
            findDiscount.Code = discountDTO.Code;
            findDiscount.Description = discountDTO.Description;
            findDiscount.DiscountAmount = discountDTO.DiscountAmount;
            findDiscount.DiscountPercent = discountDTO.DiscountPercent;
            findDiscount.MinOrderAmount = discountDTO.MinOrderAmount;
            findDiscount.StartDate = discountDTO.StartDate;
            findDiscount.EndDate = discountDTO.ExpiredDate;
            findDiscount.Quantity = discountDTO.Quantity;
            await _context.SaveChangesAsync();
            var updatedDiscount = new GetDiscountDTO()
            {
                Id = findDiscount.Id,
                Code = findDiscount.Code,
                CreatedDate = findDiscount.CreatedDate,
                Description = findDiscount.Description,
                DiscountAmount = findDiscount.DiscountAmount,
                DiscountPercent = findDiscount.DiscountPercent,
                EndDate = findDiscount.EndDate,
                MinOrderAmount = findDiscount.MinOrderAmount,
                Quantity = findDiscount.Quantity,
                StartDate = findDiscount.StartDate,
                IsActive = findDiscount.IsActive
            };
            return new ApiResponse<GetDiscountDTO>(null, updatedDiscount, "200", "Update discount successfully", true, 0, 0, 0, 0, null, null, null);
        }
    }
}
