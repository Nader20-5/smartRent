using SmartRent.API.DTOs.Common;

namespace SmartRent.API.Services.Interfaces
{
    public interface IReviewService
    {
        Task<ServiceResult<object>> CreateAsync(int tenantId, int propertyId, int rating, string? comment);
        Task<ServiceResult<object>> UpdateAsync(int tenantId, int reviewId, int rating, string? comment);
        Task<ServiceResult<bool>> DeleteAsync(int tenantId, int reviewId);
        Task<ServiceResult<PagedResult<object>>> GetByPropertyAsync(int propertyId, PaginationDto pagination);
    }
}
