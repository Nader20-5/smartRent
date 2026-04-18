using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Visit;

namespace SmartRent.API.Services.Interfaces
{
    public interface IVisitService
    {
        Task<ServiceResult<VisitResponseDto>> CreateAsync(int tenantId, CreateVisitDto dto);
        Task<ServiceResult<bool>> ApproveAsync(int landlordId, int visitId);
        Task<ServiceResult<bool>> RejectAsync(int landlordId, int visitId, RejectDto dto);
        Task<ServiceResult<bool>> CancelAsync(int tenantId, int visitId);
        Task<ServiceResult<PagedResult<VisitResponseDto>>> GetByTenantAsync(int tenantId, PaginationDto pagination);
        Task<ServiceResult<PagedResult<VisitResponseDto>>> GetByLandlordAsync(int landlordId, PaginationDto pagination);
    }
}
