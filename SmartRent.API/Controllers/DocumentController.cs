using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartRent.API.Data;
using SmartRent.API.Helpers;
using System.Security.Claims;
using Microsoft.AspNetCore.StaticFiles;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DocumentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AesEncryptionHelper _encryptionHelper;
        private readonly IWebHostEnvironment _env;

        public DocumentController(AppDbContext context, AesEncryptionHelper encryptionHelper, IWebHostEnvironment env)
        {
            _context = context;
            _encryptionHelper = encryptionHelper;
            _env = env;
        }

        [HttpGet("download")]
        public async Task<IActionResult> Download([FromQuery] string url)
        {
            if (string.IsNullOrEmpty(url)) return BadRequest("URL is required.");

            // 1. Find the document in the database
            var document = await _context.ApplicationDocuments
                .Include(d => d.RentalApplication)
                .ThenInclude(ra => ra.Property)
                .FirstOrDefaultAsync(d => d.DocumentUrl == url);

            if (document == null) return NotFound("Document not found.");

            // 2. Check Permissions
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            bool isAuthorized = userRole == "Admin" ||
                                document.RentalApplication.TenantId == userId ||
                                document.RentalApplication.Property.LandlordId == userId;

            if (!isAuthorized) return Forbid();

            // 3. Resolve file path
            var webRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var absolutePath = Path.Combine(webRootPath, url.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar));

            if (!System.IO.File.Exists(absolutePath)) return NotFound("File missing from storage.");

            // 4. Decrypt and return
            var memoryStream = new MemoryStream();
            await using (var fileStream = new FileStream(absolutePath, FileMode.Open, FileAccess.Read))
            {
                try
                {
                    if (absolutePath.EndsWith(".enc"))
                    {
                        await _encryptionHelper.DecryptStreamAsync(fileStream, memoryStream);
                    }
                    else
                    {
                        // Fallback for older non-encrypted files
                        await fileStream.CopyToAsync(memoryStream);
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Decryption failed: {ex.Message}");
                }
            }
            memoryStream.Position = 0;

            // 5. Determine Content Type
            var provider = new FileExtensionContentTypeProvider();
            var originalExtension = Path.GetExtension(absolutePath.Replace(".enc", ""));
            if (!provider.TryGetContentType($"dummy{originalExtension}", out var contentType))
            {
                contentType = "application/octet-stream";
            }

            var fileName = $"document{originalExtension}";
            return File(memoryStream, contentType, fileName);
        }
    }
}
