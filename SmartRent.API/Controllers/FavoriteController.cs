using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.Services.Interfaces;
using System.Security.Claims;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/favorites")]
    [Authorize(Roles = "Tenant")]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET /api/favorites
        // Tenant — all favorited properties
        // ─────────────────────────────────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            int userId = GetCurrentUserIdOrThrow();
            var result = await _favoriteService.GetUserFavoritesAsync(userId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(result.Data);
        }

        // ─────────────────────────────────────────────────────────────────────
        // POST /api/favorites/{propertyId}
        // Tenant — add property to favorites
        // ─────────────────────────────────────────────────────────────────────
        [HttpPost("{propertyId:int}")]
        public async Task<IActionResult> AddFavorite(int propertyId)
        {
            int userId = GetCurrentUserIdOrThrow();
            var result = await _favoriteService.AddFavoriteAsync(userId, propertyId);

            if (!result.Success)
            {
                if (result.Message!.Contains("not found"))
                    return NotFound(new { message = result.Message });

                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message, propertyId });
        }

        // ─────────────────────────────────────────────────────────────────────
        // DELETE /api/favorites/{propertyId}
        // Tenant — remove property from favorites
        // ─────────────────────────────────────────────────────────────────────
        [HttpDelete("{propertyId:int}")]
        public async Task<IActionResult> RemoveFavorite(int propertyId)
        {
            int userId = GetCurrentUserIdOrThrow();
            var result = await _favoriteService.RemoveFavoriteAsync(userId, propertyId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message, propertyId });
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
