using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Rental;

namespace SmartRent.API.Services.Interfaces
{
    public interface IRentalService
    {
        Task<ServiceResult<RentalResponseDto>> CreateAsync(int tenantId, CreateRentalDto dto);
        Task<ServiceResult<bool>> ApproveAsync(int landlordId, int applicationId);
        Task<ServiceResult<bool>> RejectAsync(int landlordId, int applicationId, RejectDto dto);
        Task<ServiceResult<PagedResult<RentalResponseDto>>> GetByTenantAsync(int tenantId, PaginationDto pagination);
        Task<ServiceResult<PagedResult<RentalResponseDto>>> GetByLandlordAsync(int landlordId, PaginationDto pagination);
        Task<ServiceResult<bool>> UploadDocumentAsync(int tenantId, int applicationId, string documentPath, string documentType);
    }
}
