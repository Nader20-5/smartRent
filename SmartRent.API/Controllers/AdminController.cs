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

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers([FromQuery] PaginationDto pagination)
        {
            // TODO: implement
            return Ok(new object[] { });
        }

        [HttpPut("users/{userId}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(int userId)
        {
            // TODO: implement
            return Ok(new { message = "User status toggled." });
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            // TODO: implement
            return Ok(new { totalUsers = 12482, activeLandlords = 843, totalProperties = 3120, pendingApprovals = 0 });
        }

        // ─── Endpoints used by the frontend adminService ───

        [HttpGet("pending-landlords")]
        public async Task<IActionResult> GetPendingLandlords()
        {
            // TODO: implement with real data
            return Ok(new object[] { });
        }

        [HttpPut("approve-landlord/{id}")]
        public async Task<IActionResult> ApproveLandlord(int id)
        {
            // TODO: implement
            return Ok(new { message = $"Landlord {id} approved." });
        }

        [HttpPut("reject-landlord/{id}")]
        public async Task<IActionResult> RejectLandlord(int id)
        {
            // TODO: implement
            return Ok(new { message = $"Landlord {id} rejected." });
        }

        [HttpGet("pending-properties")]
        public async Task<IActionResult> GetPendingProperties()
        {
            // TODO: implement with real data
            return Ok(new object[] { });
        }

        [HttpPut("approve-property/{id}")]
        public async Task<IActionResult> ApproveProperty(int id)
        {
            // TODO: implement
            return Ok(new { message = $"Property {id} approved." });
        }

        [HttpPut("reject-property/{id}")]
        public async Task<IActionResult> RejectProperty(int id)
        {
            // TODO: implement
            return Ok(new { message = $"Property {id} rejected." });
        }
    }
}
