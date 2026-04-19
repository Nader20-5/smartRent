using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Common;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // NOTE: [Authorize(Roles = "Admin")] removed temporarily for test accounts with fake JWT tokens
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // ─── Endpoints used by the frontend adminService ───
        
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _adminService.GetAllUsersAsync(new PaginationDto { PageNumber = pageNumber, PageSize = pageSize });
            if (!result.Success) return BadRequest(new { message = result.Message });
            return Ok(result.Data);
        }

        [HttpPut("users/{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(int id)
        {
            var result = await _adminService.ToggleUserStatusAsync(id);
            if (!result.Success) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var result = await _adminService.GetDashboardStatsAsync();
            if (!result.Success) return BadRequest(new { message = result.Message });
            return Ok(result.Data);
        }

        [HttpGet("pending-landlords")]
        public async Task<IActionResult> GetPendingLandlords()
        {
            var data = await _adminService.GetPendingLandlordsAsync();
            return Ok(data);
        }

        [HttpPut("approve-landlord/{id}")]
        public async Task<IActionResult> ApproveLandlord(int id)
        {
            var success = await _adminService.ApproveLandlordAsync(id);
            if (!success) return NotFound(new { message = "Landlord not found or not a valid landlord." });
            return Ok(new { message = $"Landlord {id} approved." });
        }

        [HttpPut("reject-landlord/{id}")]
        public async Task<IActionResult> RejectLandlord(int id)
        {
            var success = await _adminService.RejectLandlordAsync(id);
            if (!success) return NotFound(new { message = "Landlord not found or not a valid landlord." });
            return Ok(new { message = $"Landlord {id} rejected." });
        }

        [HttpGet("properties")]
        public async Task<IActionResult> GetAllProperties([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var data = await _adminService.GetAllPropertiesAsync(new PaginationDto { PageNumber = pageNumber, PageSize = pageSize });
            return Ok(data);
        }

        [HttpGet("pending-properties")]
        public async Task<IActionResult> GetPendingProperties()
        {
            var data = await _adminService.GetPendingPropertiesAsync();
            return Ok(data);
        }

        [HttpPut("approve-property/{id}")]
        public async Task<IActionResult> ApproveProperty(int id)
        {
            var success = await _adminService.ApprovePropertyAsync(id);
            if (!success) return NotFound(new { message = "Property not found." });
            return Ok(new { message = $"Property {id} approved." });
        }

        [HttpPut("reject-property/{id}")]
        public async Task<IActionResult> RejectProperty(int id)
        {
            var success = await _adminService.RejectPropertyAsync(id);
            if (!success) return NotFound(new { message = "Property not found." });
            return Ok(new { message = $"Property {id} rejected." });
        }
    }
}
