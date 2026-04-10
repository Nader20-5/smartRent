using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Review;
using SmartRent.API.Services.Interfaces;
using System.Security.Claims;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET /api/reviews/property/{propertyId}
        // Public — get all reviews for a property
        // ─────────────────────────────────────────────────────────────────────
        [HttpGet("property/{propertyId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByProperty(int propertyId)
        {
            var result = await _reviewService.GetByPropertyAsync(propertyId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(result.Data);
        }

        // ─────────────────────────────────────────────────────────────────────
        // POST /api/reviews
        // Tenant — submit a review (Rating 1–5 + optional Comment)
        // ─────────────────────────────────────────────────────────────────────
        [HttpPost]
        [Authorize(Roles = "Tenant")]
        public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int tenantId = GetCurrentUserIdOrThrow();
            var result = await _reviewService.CreateAsync(tenantId, dto);

            if (!result.Success)
            {
                if (result.Message!.Contains("not found"))
                    return NotFound(new { message = result.Message });

                return BadRequest(new { message = result.Message });
            }

            return CreatedAtAction(
                nameof(GetByProperty),
                new { propertyId = dto.PropertyId },
                result.Data);
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
