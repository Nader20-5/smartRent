using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
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

        public async Task<ServiceResult<object>> CreateAsync(int tenantId, int propertyId, int rating, string? comment)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<object>> UpdateAsync(int tenantId, int reviewId, int rating, string? comment)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> DeleteAsync(int tenantId, int reviewId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PagedResult<object>>> GetByPropertyAsync(int propertyId, PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }
    }
}
