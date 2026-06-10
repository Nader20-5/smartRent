using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Rental;
using SmartRent.API.Services.Interfaces;
using System.Security.Claims;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class RentalController : ControllerBase
    {
        private readonly IRentalService _rentalService;

        public RentalController(IRentalService rentalService)
        {
            _rentalService = rentalService;
        }

        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        [HttpPost]
        [Authorize(Roles = "Tenant")] 
        public async Task<IActionResult> Create([FromForm] CreateRentalDto dto)
        {
            int tenantId = GetUserId();
            var result = await _rentalService.CreateAsync(tenantId, dto);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Landlord")] 
        public async Task<IActionResult> Approve(int id)
        {
            int landlordId = GetUserId();
            var result = await _rentalService.ApproveAsync(landlordId, id);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Landlord")] 
        public async Task<IActionResult> Reject(int id, [FromBody] RejectDto dto)
        {
            int landlordId = GetUserId();
            var result = await _rentalService.RejectAsync(landlordId, id, dto);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("tenant")]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> GetByTenant([FromQuery] PaginationDto pagination)
        {
            int tenantId = GetUserId();
            var result = await _rentalService.GetByTenantAsync(tenantId, pagination);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("landlord")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> GetByLandlord([FromQuery] PaginationDto pagination)
        {
            int landlordId = GetUserId();
            var result = await _rentalService.GetByLandlordAsync(landlordId, pagination);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost("{id}/documents")]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> UploadDocument(int id, IFormFile file, [FromQuery] string documentType)
        {
            int tenantId = GetUserId();

            if (file == null || file.Length == 0)
                return BadRequest("No file was uploaded.");

            var result = await _rentalService.UploadAdditionalDocumentAsync(tenantId, id, file, documentType);

            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}