using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Property;
using SmartRent.API.Services.Interfaces;
using System.Security.Claims;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/property")]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public PropertyController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        // Retrieves all filtered property listings
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? location,
            [FromQuery] string? propertyType,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice)
        {
            int? currentUserId = GetCurrentUserId();
            var result = await _propertyService.GetAllAsync(location, propertyType, minPrice, maxPrice, currentUserId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(result.Data);
        }

        // Retrieves properties owned by landlord
        [HttpGet("my")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> GetMy()
        {
            int landlordId = GetCurrentUserIdOrThrow();
            var result = await _propertyService.GetByLandlordAsync(landlordId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(result.Data);
        }

        // Retrieves property details by ID
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            int? currentUserId = GetCurrentUserId();
            var result = await _propertyService.GetByIdAsync(id, currentUserId);

            if (!result.Success)
                return NotFound(new { message = result.Message });

            return Ok(result.Data);
        }

        // Creates a new property listing
        [HttpPost]
        [Authorize(Roles = "Landlord")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreatePropertyDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int landlordId = GetCurrentUserIdOrThrow();
            var result = await _propertyService.CreateAsync(landlordId, dto);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
        }

        // Updates existing property listing details
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePropertyDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int landlordId = GetCurrentUserIdOrThrow();
            var result = await _propertyService.UpdateAsync(landlordId, id, dto);

            if (!result.Success)
            {
                if (result.Message!.Contains("not found"))
                    return NotFound(new { message = result.Message });

                if (result.Message.Contains("Unauthorized"))
                    return Forbid();

                return BadRequest(new { message = result.Message });
            }

            return Ok(result.Data);
        }

        // Soft deletes a property listing
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> Delete(int id)
        {
            int landlordId = GetCurrentUserIdOrThrow();
            var result = await _propertyService.DeleteAsync(landlordId, id);

            if (!result.Success)
            {
                if (result.Message!.Contains("not found"))
                    return NotFound(new { message = result.Message });

                if (result.Message.Contains("Unauthorized"))
                    return Forbid();

                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message });
        }

        // Uploads additional images for property
        [HttpPost("{id:int}/images")]
        [Authorize(Roles = "Landlord")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImages(int id, [FromForm] List<IFormFile> images)
        {
            if (images == null || images.Count == 0)
                return BadRequest(new { message = "No images provided." });

            int landlordId = GetCurrentUserIdOrThrow();
            var result = await _propertyService.UploadImagesAsync(landlordId, id, images);

            if (!result.Success)
            {
                if (result.Message!.Contains("not found"))
                    return NotFound(new { message = result.Message });

                if (result.Message.Contains("Unauthorized"))
                    return Forbid();

                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message, imageUrls = result.Data });
        }

        // Retrieves current user ID from claims
        private int? GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? User.FindFirst("sub")?.Value;

            return int.TryParse(claim, out var id) ? id : null;
        }

        // Retrieves current user ID or throws
        private int GetCurrentUserIdOrThrow()
        {
            return GetCurrentUserId()
                ?? throw new UnauthorizedAccessException("User is not authenticated.");
        }
    }
}
