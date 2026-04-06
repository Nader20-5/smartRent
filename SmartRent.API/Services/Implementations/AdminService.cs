using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
using SmartRent.API.Models;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResult<PagedResult<User>>> GetAllUsersAsync(PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> ToggleUserStatusAsync(int userId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<object>> GetDashboardStatsAsync()
        {
            // TODO: implement
            throw new NotImplementedException();
        }
    }
}
