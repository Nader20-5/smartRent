using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
using SmartRent.API.Models;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResult<bool>> CreateAsync(int userId, string title, string message, string? type = null, string? link = null)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PagedResult<Notification>>> GetByUserAsync(int userId, PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> MarkAsReadAsync(int userId, int notificationId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> MarkAllAsReadAsync(int userId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<int>> GetUnreadCountAsync(int userId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }
    }
}
