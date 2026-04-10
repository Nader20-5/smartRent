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
                User = new UserDto
                {
                    Id = 999,
                    Email = dto.Email,
                    FullName = dto.FirstName + " " + dto.LastName,
                    Role = "Tenant",
                    ProfileImage = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (dto.Email == "tenant@test.com") {
                return Ok(new AuthResponseDto {
                    Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tenant_token",
                    User = new UserDto { Id = 100, Email = "tenant@test.com", FullName = "Alex Tenant", Role = "Tenant", ProfileImage = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" }
                });
            }
            if (dto.Email == "landlord@test.com") {
                return Ok(new AuthResponseDto {
                    Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.landlord_token",
                    User = new UserDto { Id = 101, Email = "landlord@test.com", FullName = "Sarah Landlord", Role = "Landlord", ProfileImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" }
                });
            }
            if (dto.Email == "admin@test.com") {
                return Ok(new AuthResponseDto {
                    Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin_token",
                    User = new UserDto { Id = 102, Email = "admin@test.com", FullName = "Max Admin", Role = "Admin", ProfileImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" }
                });
            }

            return Unauthorized(new { message = "Invalid email or password. Use the test credentials." });
        }
    }
}
