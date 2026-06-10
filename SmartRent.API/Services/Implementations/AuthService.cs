using Microsoft.EntityFrameworkCore;
using SmartRent.API.DTOs.Auth;
using SmartRent.API.DTOs.Common;
using SmartRent.API.Helpers;
using SmartRent.API.Models;
using SmartRent.API.Repositories.Interfaces;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly JwtHelper _jwtHelper;
        private readonly INotificationService _notificationService;

        public AuthService(IUnitOfWork unitOfWork, JwtHelper jwtHelper, INotificationService notificationService)
        {
            _unitOfWork = unitOfWork;
            _jwtHelper = jwtHelper;
            _notificationService = notificationService;
        }

        // Registers new user and sends notifications
        public async Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterDto dto)
        {
            if (await _unitOfWork.Users.AnyAsync(u => u.Email == dto.Email))
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
                IsApproved = dto.Role == "Tenant", 
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            try
            {
                await _notificationService.CreateAsync(
                    user.Id,
                    "Welcome to SmartRent!",
                    $"Hello {dto.FirstName}, thank you for joining SmartRent. We're excited to help you find your next home!",
                    "Welcome",
                    user.Role == "Landlord" ? "/landlord/dashboard" : "/properties"
                );
            }
            catch { }

            if (user.Role == "Landlord")
            {
                try
                {
                    await _notificationService.NotifyAdminsAsync(
                        "New Landlord Registered",
                        $"A new landlord '{user.FullName}' has registered and is awaiting approval.",
                        "LandlordRegistration",
                        "/admin/dashboard"
                    );
                }
                catch { }
            }

            var token = _jwtHelper.GenerateToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Role = user.Role,
                ProfileImage = user.ProfileImage
            };

            return ServiceResult<AuthResponseDto>.SuccessResult(response, "Registration successful.");
        }

        // Authenticates user and returns JWT token
        public async Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto dto)
        {
            var user = await _unitOfWork.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !user.IsActive)
            {
                return ServiceResult<AuthResponseDto>.FailureResult("Invalid email or password.");
            }

            if (!user.IsApproved)
            {
                return ServiceResult<AuthResponseDto>.FailureResult("Your account is pending admin approval.");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return ServiceResult<AuthResponseDto>.FailureResult("Invalid email or password.");
            }

            var token = _jwtHelper.GenerateToken(user);
            
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
                Role = user.Role,
                ProfileImage = user.ProfileImage
            };

            return ServiceResult<AuthResponseDto>.SuccessResult(response, "Login successful.");
        }
    }
}
