using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRent.API.Data;
using SmartRent.API.DTOs.Review;
using SmartRent.API.DTOs.User;
using SmartRent.API.Helpers;
using System.Security.Claims;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly FileUploadHelper _fileUploadHelper;

        public UserController(AppDbContext context, FileUploadHelper fileUploadHelper)
        {
            _context = context;
            _fileUploadHelper = fileUploadHelper;
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET /api/user/profile
        // Fetch the current user's profile including their reviews
        // ─────────────────────────────────────────────────────────────────────
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            int userId = GetCurrentUserIdOrThrow();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { message = "User not found." });

            // Get reviews written by this user
            var myReviews = await _context.Reviews
                .Include(r => r.Property)
                .Where(r => r.TenantId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewResponseDto
                {
                    Id = r.Id,
                    PropertyId = r.PropertyId,
                    TenantId = r.TenantId,
                    TenantFullName = user.FullName,
                    TenantProfileImage = user.ProfileImage,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    PropertyTitle = r.Property.Title
                })
                .ToListAsync();

            // Get reviews on this user's properties (if landlord)
            var receivedReviews = await _context.Reviews
                .Include(r => r.Tenant)
                .Include(r => r.Property)
                .Where(r => r.Property.LandlordId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewResponseDto
                {
                    Id = r.Id,
                    PropertyId = r.PropertyId,
                    TenantId = r.TenantId,
                    TenantFullName = r.Tenant.FullName,
                    TenantProfileImage = r.Tenant.ProfileImage,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    PropertyTitle = r.Property.Title
                })
                .ToListAsync();

            var propertiesCount = await _context.Properties
                .CountAsync(p => p.LandlordId == userId && p.IsActive);

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                phoneNumber = user.PhoneNumber,
                role = user.Role,
                profileImage = user.ProfileImage,
                createdAt = user.CreatedAt,
                propertiesCount,
                myReviews,
                receivedReviews
            });
        }

        // ─────────────────────────────────────────────────────────────────────
        // POST /api/user/profile-picture
        // Upload or update the user's profile picture
        // ─────────────────────────────────────────────────────────────────────
        [HttpPost("profile-picture")]
        public async Task<IActionResult> UploadProfilePicture([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest(new { message = "No image file provided." });

            if (!_fileUploadHelper.IsValidImage(image))
                return BadRequest(new { message = "Invalid image file. Supported: JPG, PNG, WebP. Max 5 MB." });

            int userId = GetCurrentUserIdOrThrow();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            // Delete old profile image if it exists
            if (!string.IsNullOrEmpty(user.ProfileImage))
            {
                _fileUploadHelper.DeleteFile(user.ProfileImage);
            }

            var folder = $"uploads/profiles/{userId}";
            var imageUrl = await _fileUploadHelper.UploadFileAsync(image, folder);

            user.ProfileImage = imageUrl;
            await _context.SaveChangesAsync();

            return Ok(new { profileImage = imageUrl });
        }

        // ─────────────────────────────────────────────────────────────────────
        // PUT /api/user/profile
        // Update user profile information
        // ─────────────────────────────────────────────────────────────────────
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int userId = GetCurrentUserIdOrThrow();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                phoneNumber = user.PhoneNumber,
                role = user.Role,
                profileImage = user.ProfileImage
            });
        }

        // ─────────────────────────────────────────────────────────────────────
        // PRIVATE HELPERS
        // ─────────────────────────────────────────────────────────────────────
        private int GetCurrentUserIdOrThrow()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? User.FindFirst("sub")?.Value;

            return int.TryParse(claim, out var id)
                ? id
                : throw new UnauthorizedAccessException("User is not authenticated.");
        }
    }
}
