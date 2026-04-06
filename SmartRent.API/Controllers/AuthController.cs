using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Auth;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // TODO: implement
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // TODO: implement
            return Ok();
        }
    }
}
