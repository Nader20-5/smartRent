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
            return Ok(new AuthResponseDto
            {
                Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token",
                UserId = 999,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Role = "Tenant"
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (dto.Email == "tenant@test.com") {
                return Ok(new AuthResponseDto {
                    Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tenant_token",
                    UserId = 100, Email = "tenant@test.com", FirstName = "Alex", LastName = "Tenant", Role = "Tenant"
                });
            }
            if (dto.Email == "landlord@test.com") {
                return Ok(new AuthResponseDto {
                    Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.landlord_token",
                    UserId = 101, Email = "landlord@test.com", FirstName = "Sarah", LastName = "Landlord", Role = "Landlord"
                });
            }
            if (dto.Email == "admin@test.com") {
                return Ok(new AuthResponseDto {
                    Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin_token",
                    UserId = 102, Email = "admin@test.com", FirstName = "Max", LastName = "Admin", Role = "Admin"
                });
            }

            return Unauthorized(new { message = "Invalid email or password. Use the test credentials." });
        }
    }
}
