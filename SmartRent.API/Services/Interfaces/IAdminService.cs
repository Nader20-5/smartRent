using SmartRent.API.DTOs.Common;
using SmartRent.API.Models;

namespace SmartRent.API.Services.Interfaces
{
    public interface IAdminService
    {
        Task<ServiceResult<PagedResult<User>>> GetAllUsersAsync(PaginationDto pagination);
        Task<ServiceResult<bool>> ToggleUserStatusAsync(int userId);
        Task<ServiceResult<object>> GetDashboardStatsAsync();
        
        Task<IEnumerable<object>> GetPendingLandlordsAsync();
        Task<bool> ApproveLandlordAsync(int id);
        Task<bool> RejectLandlordAsync(int id);
        
        Task<IEnumerable<object>> GetAllPropertiesAsync(PaginationDto pagination);
        Task<IEnumerable<object>> GetPendingPropertiesAsync();
        Task<bool> ApprovePropertyAsync(int id);
        Task<bool> RejectPropertyAsync(int id);
    }
}
