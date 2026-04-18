using SmartRent.API.DTOs.Common;
using SmartRent.API.Models;

namespace SmartRent.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task<ServiceResult<bool>> CreateAsync(int userId, string title, string message, string? type = null, string? link = null);
        Task<ServiceResult<PagedResult<Notification>>> GetByUserAsync(int userId, PaginationDto pagination);
        Task<ServiceResult<bool>> MarkAsReadAsync(int userId, int notificationId);
        Task<ServiceResult<bool>> MarkAllAsReadAsync(int userId);
        Task<ServiceResult<int>> GetUnreadCountAsync(int userId);
    }
}
