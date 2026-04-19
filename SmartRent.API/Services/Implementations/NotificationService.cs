using Microsoft.AspNetCore.SignalR; 
using Microsoft.EntityFrameworkCore;
using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
using SmartRent.API.Hubs; 
using SmartRent.API.Models;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{

    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task<ServiceResult<bool>> CreateAsync(int userId, string title, string message, string? type = null, string? link = null)
        {
            try
            {
                var notification = new Notification { UserId = userId, Title = title, Message = message, Type = type, Link = link, IsRead = false, CreatedAt = DateTime.UtcNow };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                await _hubContext.Clients.Group(userId.ToString()).SendAsync("ReceiveNotification", new
                {
                    id = notification.Id,
                    title = notification.Title,
                    message = notification.Message,
                    type = notification.Type,
                    link = notification.Link,
                    createdAt = notification.CreatedAt
                });

                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"Error creating notification: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        public async Task<ServiceResult<PagedResult<Notification>>> GetByUserAsync(int userId, PaginationDto pagination)
        {
            try
            {
                var query = _context.Notifications
                    .Where(n => n.UserId == userId)
                    .OrderByDescending(n => n.CreatedAt);

                var totalCount = await query.CountAsync();

                
                var items = await query
                    .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                    .Take(pagination.PageSize)
                    .ToListAsync();

                var pagedResult = new PagedResult<Notification>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = pagination.PageNumber,
                    PageSize = pagination.PageSize
                };

                return ServiceResult<PagedResult<Notification>>.SuccessResult(pagedResult);
            }
            catch (Exception ex)
            {
                return ServiceResult<PagedResult<Notification>>.FailureResult($"Failed to fetch notifications: {ex.Message}");
            }
        }

        public async Task<ServiceResult<bool>> MarkAsReadAsync(int userId, int notificationId)
        {
            try
            {
                var notification = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

                if (notification == null)
                {
                    return ServiceResult<bool>.FailureResult("Notification not found or access denied.");
                }

                if (notification.IsRead)
                {
                    return ServiceResult<bool>.SuccessResult(true);
                }

                notification.IsRead = true;
                await _context.SaveChangesAsync();

                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"Error marking notification as read: {ex.Message}");
            }
        }

        public async Task<ServiceResult<bool>> MarkAllAsReadAsync(int userId)
        {
            try
            {
                await _context.Notifications
                    .Where(n => n.UserId == userId && !n.IsRead)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(n => n.IsRead, true));

                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"Failed to mark all as read: {ex.Message}");
            }
        }

        public async Task<ServiceResult<int>> GetUnreadCountAsync(int userId)
        {
            try
            {
                var count = await _context.Notifications
                    .CountAsync(n => n.UserId == userId && !n.IsRead);

                return ServiceResult<int>.SuccessResult(count);
            }
            catch (Exception ex)
            {
                return ServiceResult<int>.FailureResult($"Database error: {ex.Message}");
            }
        }
    }
}