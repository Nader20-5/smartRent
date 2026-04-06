using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Common;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost("property/{propertyId}")]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> Create(int propertyId, [FromBody] object dto)
        {
            // TODO: implement
            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> Update(int id, [FromBody] object dto)
        {
            // TODO: implement
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> Delete(int id)
        {
            // TODO: implement
            return Ok();
        }

        [HttpGet("property/{propertyId}")]
        public async Task<IActionResult> GetByProperty(int propertyId, [FromQuery] PaginationDto pagination)
        {
            // TODO: implement
            return Ok();
        }
    }
}
