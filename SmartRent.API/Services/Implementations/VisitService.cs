using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Visit;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{
    public class VisitService : IVisitService
    {
        private readonly AppDbContext _context;

        public VisitService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResult<VisitResponseDto>> CreateAsync(int tenantId, CreateVisitDto dto)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> ApproveAsync(int landlordId, int visitId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> RejectAsync(int landlordId, int visitId, RejectDto dto)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> CancelAsync(int tenantId, int visitId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PagedResult<VisitResponseDto>>> GetByTenantAsync(int tenantId, PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PagedResult<VisitResponseDto>>> GetByLandlordAsync(int landlordId, PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }
    }
}
