using SmartRent.API.Data;
using SmartRent.API.DTOs.Auth;
using SmartRent.API.DTOs.Common;
using SmartRent.API.Helpers;
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
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto dto)
        {
            // TODO: implement
            throw new NotImplementedException();
        }
    }
}
