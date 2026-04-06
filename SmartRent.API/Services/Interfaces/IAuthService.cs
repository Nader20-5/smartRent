using SmartRent.API.DTOs.Auth;
using SmartRent.API.DTOs.Common;

namespace SmartRent.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterDto dto);
        Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto dto);
    }
}
