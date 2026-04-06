using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Visit;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VisitController : ControllerBase
    {
        private readonly IVisitService _visitService;

        public VisitController(IVisitService visitService)
        {
            _visitService = visitService;
        }

        [HttpPost]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> Create([FromBody] CreateVisitDto dto)
        {
            // TODO: implement
            return Ok();
        }

        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> Approve(int id)
        {
            // TODO: implement
            return Ok();
        }

        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectDto dto)
        {
            // TODO: implement
            return Ok();
        }

        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> Cancel(int id)
        {
            // TODO: implement
            return Ok();
        }

        [HttpGet("tenant")]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> GetByTenant([FromQuery] PaginationDto pagination)
        {
            // TODO: implement
            return Ok();
        }

        [HttpGet("landlord")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> GetByLandlord([FromQuery] PaginationDto pagination)
        {
            // TODO: implement
            return Ok();
        }
    }
}
