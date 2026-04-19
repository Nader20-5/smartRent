using Microsoft.EntityFrameworkCore;
using SmartRent.API.Data;
using SmartRent.API.DTOs.Auth;
using SmartRent.API.DTOs.Common;
using SmartRent.API.Helpers;
using SmartRent.API.Models;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return ServiceResult<AuthResponseDto>.FailureResult("User with this email already exists.");
            }

            var user = new User
            {
                FullName = $"{dto.FirstName} {dto.LastName}".Trim(),
                Email = dto.Email,
                PhoneNumber = dto.Phone,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                // Landlords require manual approval, Tenants are auto-approved
                IsApproved = dto.Role == "Tenant", 
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtHelper.GenerateToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Role = user.Role
            };

            return ServiceResult<AuthResponseDto>.SuccessResult(response, "Registration successful.");
        }

        public async Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !user.IsActive)
            {
                return ServiceResult<AuthResponseDto>.FailureResult("Invalid email or password.");
            }

            if (!user.IsApproved)
            {
                return ServiceResult<AuthResponseDto>.FailureResult("Your account is pending admin approval.");
            }

            bool isPasswordValid = false;
            if (user.PasswordHash == "hashed_pw" && dto.Password == "password123")
            {
                isPasswordValid = true; // Support for legacy hardcoded test accounts
            }
            else
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            }

            if (!isPasswordValid)
            {
                return ServiceResult<AuthResponseDto>.FailureResult("Invalid email or password.");
            }

            var token = _jwtHelper.GenerateToken(user);
            
            // split name simply to fit AuthResponseDto
            var nameParts = user.FullName.Split(' ');
            var firstName = nameParts.Length > 0 ? nameParts[0] : "";
            var lastName = nameParts.Length > 1 ? string.Join(" ", nameParts.Skip(1)) : "";

            var response = new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                FirstName = firstName,
                LastName = lastName,
                Role = user.Role
            };

            return ServiceResult<AuthResponseDto>.SuccessResult(response, "Login successful.");
        }
    }
}
