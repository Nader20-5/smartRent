using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Review;

namespace SmartRent.API.Services.Interfaces
{
    public interface IReviewService
    {
        /// <summary>Creates a review for a property. One review per tenant per property (enforced by DB unique index).</summary>
        Task<ServiceResult<ReviewResponseDto>> CreateAsync(int tenantId, CreateReviewDto dto);

        /// <summary>Returns all reviews for a given property (paginated).</summary>
        Task<ServiceResult<List<ReviewResponseDto>>> GetByPropertyAsync(int propertyId);

        // Kept for compat with existing interface
        Task<ServiceResult<object>> UpdateAsync(int tenantId, int reviewId, int rating, string? comment);
        Task<ServiceResult<bool>> DeleteAsync(int tenantId, int reviewId);
        Task<ServiceResult<PagedResult<object>>> GetByPropertyAsync(int propertyId, PaginationDto pagination);
        Task<ServiceResult<object>> CreateAsync(int tenantId, int propertyId, int rating, string? comment);
    }
}
