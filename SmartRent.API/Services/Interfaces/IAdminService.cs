using SmartRent.API.DTOs.Common;
using SmartRent.API.Models;

namespace SmartRent.API.Services.Interfaces
{
    public interface IAdminService
    {
        Task<ServiceResult<PagedResult<User>>> GetAllUsersAsync(PaginationDto pagination);
        Task<ServiceResult<bool>> ToggleUserStatusAsync(int userId);
        Task<ServiceResult<object>> GetDashboardStatsAsync();
    }
}
