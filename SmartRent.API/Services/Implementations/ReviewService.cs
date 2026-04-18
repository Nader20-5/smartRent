using Microsoft.EntityFrameworkCore;
using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Review;
using SmartRent.API.Models;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResult<ReviewResponseDto>> CreateAsync(int tenantId, CreateReviewDto dto)
        {
            try
            {
                var propertyExists = await _context.Properties.AnyAsync(p => p.Id == dto.PropertyId);
                if (!propertyExists)
                    return ServiceResult<ReviewResponseDto>.FailureResult("Property not found.");

                var existingReview = await _context.Reviews
                    .AnyAsync(r => r.TenantId == tenantId && r.PropertyId == dto.PropertyId);
                if (existingReview)
                    return ServiceResult<ReviewResponseDto>.FailureResult("You have already reviewed this property.");

                var review = new Review
                {
                    PropertyId = dto.PropertyId,
                    TenantId   = tenantId,
                    Rating     = dto.Rating,
                    Comment    = dto.Comment?.Trim(),
                    CreatedAt  = DateTime.UtcNow
                };

                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();

                var responseDto = await MapToResponseDtoAsync(review.Id);
                return ServiceResult<ReviewResponseDto>.SuccessResult(responseDto!, "Review submitted successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<ReviewResponseDto>.FailureResult($"Failed to submit review: {ex.Message}");
            }
        }

        public async Task<ServiceResult<List<ReviewResponseDto>>> GetByPropertyAsync(int propertyId)
        {
            try
            {
                var reviews = await _context.Reviews
                    .Include(r => r.Tenant)
                    .Where(r => r.PropertyId == propertyId)
                    .OrderByDescending(r => r.CreatedAt)
                    .ToListAsync();

                var dtos = reviews.Select(r => new ReviewResponseDto
                {
                    Id                 = r.Id,
                    PropertyId         = r.PropertyId,
                    TenantId           = r.TenantId,
                    TenantFullName     = r.Tenant.FullName,
                    TenantProfileImage = r.Tenant.ProfileImage,
                    Rating             = r.Rating,
                    Comment            = r.Comment,
                    CreatedAt          = r.CreatedAt
                }).ToList();

                return ServiceResult<List<ReviewResponseDto>>.SuccessResult(dtos);
            }
            catch (Exception ex)
            {
                return ServiceResult<List<ReviewResponseDto>>.FailureResult($"Failed to retrieve reviews: {ex.Message}");
            }
        }

        public async Task<ServiceResult<object>> UpdateAsync(int tenantId, int reviewId, int rating, string? comment)
        {
            try
            {
                var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
                if (review == null)
                    return ServiceResult<object>.FailureResult("Review not found.");
                if (review.TenantId != tenantId)
                    return ServiceResult<object>.FailureResult("Unauthorized: You did not write this review.");

                review.Rating  = rating;
                review.Comment = comment?.Trim();
                await _context.SaveChangesAsync();

                var responseDto = await MapToResponseDtoAsync(review.Id);
                return ServiceResult<object>.SuccessResult(responseDto!, "Review updated successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<object>.FailureResult($"Failed to update review: {ex.Message}");
            }
        }

        public async Task<ServiceResult<bool>> DeleteAsync(int tenantId, int reviewId)
        {
            try
            {
                var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
                if (review == null)
                    return ServiceResult<bool>.FailureResult("Review not found.");
                if (review.TenantId != tenantId)
                    return ServiceResult<bool>.FailureResult("Unauthorized: You did not write this review.");

                _context.Reviews.Remove(review);
                await _context.SaveChangesAsync();
                return ServiceResult<bool>.SuccessResult(true, "Review deleted successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"Failed to delete review: {ex.Message}");
            }
        }

        public async Task<ServiceResult<PagedResult<object>>> GetByPropertyAsync(int propertyId, PaginationDto pagination)
        {
            var result = await GetByPropertyAsync(propertyId);
            if (!result.Success)
                return ServiceResult<PagedResult<object>>.FailureResult(result.Message!);

            var items = (result.Data ?? new List<ReviewResponseDto>()).Cast<object>().ToList();
            var paged = new PagedResult<object>
            {
                Items = items.Skip((pagination.PageNumber - 1) * pagination.PageSize).Take(pagination.PageSize).ToList(),
                TotalCount = items.Count,
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize
            };
            return ServiceResult<PagedResult<object>>.SuccessResult(paged);
        }

        public async Task<ServiceResult<object>> CreateAsync(int tenantId, int propertyId, int rating, string? comment)
        {
            var dto = new CreateReviewDto { PropertyId = propertyId, Rating = rating, Comment = comment };
            var result = await CreateAsync(tenantId, dto);
            if (!result.Success) return ServiceResult<object>.FailureResult(result.Message!);
            return ServiceResult<object>.SuccessResult(result.Data!, result.Message);
        }

        private async Task<ReviewResponseDto?> MapToResponseDtoAsync(int reviewId)
        {
            var r = await _context.Reviews.Include(r => r.Tenant).FirstOrDefaultAsync(r => r.Id == reviewId);
            if (r == null) return null;

            return new ReviewResponseDto
            {
                Id                 = r.Id,
                PropertyId         = r.PropertyId,
                TenantId           = r.TenantId,
                TenantFullName     = r.Tenant.FullName,
                TenantProfileImage = r.Tenant.ProfileImage,
                Rating             = r.Rating,
                Comment            = r.Comment,
                CreatedAt          = r.CreatedAt
            };
        }
    }
}
