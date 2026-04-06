using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Rental;
using SmartRent.API.Services.Interfaces;

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

        [HttpPost]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> Create([FromBody] CreateRentalDto dto)
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

        [HttpPost("{id}/documents")]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> UploadDocument(int id)
        {
            // TODO: implement
            return Ok();
        }
    }
}
