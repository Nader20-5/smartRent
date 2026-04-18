using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Visit;
using SmartRent.API.Services.Interfaces;
using System.Security.Claims;


namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class VisitController : ControllerBase
    {
        private readonly IVisitService _visitService;

        public VisitController(IVisitService visitService)
        {
            _visitService = visitService;
        }

        private bool TryGetUserId(out int userId)
        {
            userId = 0;
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);

            return !string.IsNullOrEmpty(userIdStr) && int.TryParse(userIdStr, out userId);
        }

        [HttpPost]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> Create([FromBody] CreateVisitDto dto)
        {
            if (!TryGetUserId(out int userId)) return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _visitService.CreateAsync(userId, dto);
            if (!result.Success) return BadRequest(result.Message);

            return CreatedAtAction(nameof(GetByTenant), result.Data);
        }

        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> Approve(int id)
        {
            if (!TryGetUserId(out int userId)) return Unauthorized();

            var result = await _visitService.ApproveAsync(userId, id);

            if (!result.Success) return NotFound(result.Message);

            return Ok(result);
        }

        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectDto dto)
        {
            if (!TryGetUserId(out int userId)) return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _visitService.RejectAsync(userId, id, dto);

            if (!result.Success) return NotFound(result.Message);

            return Ok(result);
        }

        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> Cancel(int id)
        {
            if (!TryGetUserId(out int userId)) return Unauthorized();

            var result = await _visitService.CancelAsync(userId, id);
            if (!result.Success) return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpGet("tenant")]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> GetByTenant([FromQuery] PaginationDto pagination)
        {
            if (!TryGetUserId(out int userId)) return Unauthorized();

            var result = await _visitService.GetByTenantAsync(userId, pagination);
            if (!result.Success) return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpGet("landlord")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> GetByLandlord([FromQuery] PaginationDto pagination)
        {
            if (!TryGetUserId(out int userId)) return Unauthorized();

            var result = await _visitService.GetByLandlordAsync(userId, pagination);
            if (!result.Success) return BadRequest(result.Message);

            return Ok(result);
        }
    }
}