using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Common;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpPost("{propertyId}")]
        public async Task<IActionResult> ToggleFavorite(int propertyId)
        {
            // TODO: implement
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetUserFavorites([FromQuery] PaginationDto pagination)
        {
            // TODO: implement
            return Ok();
        }

        [HttpGet("{propertyId}/status")]
        public async Task<IActionResult> IsFavorited(int propertyId)
        {
            // TODO: implement
            return Ok();
        }
    }
}
