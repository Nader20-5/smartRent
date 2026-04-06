using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Rental;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{
    public class RentalService : IRentalService
    {
        private readonly AppDbContext _context;

        public RentalService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResult<RentalResponseDto>> CreateAsync(int tenantId, CreateRentalDto dto)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> ApproveAsync(int landlordId, int applicationId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> RejectAsync(int landlordId, int applicationId, RejectDto dto)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PagedResult<RentalResponseDto>>> GetByTenantAsync(int tenantId, PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PagedResult<RentalResponseDto>>> GetByLandlordAsync(int landlordId, PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> UploadDocumentAsync(int tenantId, int applicationId, string documentPath, string documentType)
        {
            // TODO: implement
            throw new NotImplementedException();
        }
    }
}
