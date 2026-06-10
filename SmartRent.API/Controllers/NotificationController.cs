using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Common;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] PaginationDto pagination)
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdString))
                return Unauthorized();

            var userId = int.Parse(userIdString);

            var result = await _notificationService.GetByUserAsync(userId, pagination);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result.Data);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdString))
                return Unauthorized();

            var userId = int.Parse(userIdString);

            var result = await _notificationService.MarkAsReadAsync(userId, id);

            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(new { success = true, message = "Notification marked as read." });
        }

        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdString))
                return Unauthorized();

            var userId = int.Parse(userIdString);

            var result = await _notificationService.MarkAllAsReadAsync(userId);

            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(new { success = true, message = "All notifications marked as read." });
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdString))
                return Unauthorized();

            var userId = int.Parse(userIdString);

            var result = await _notificationService.GetUnreadCountAsync(userId);

            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(new { count = result.Data });
        }
    }
}
