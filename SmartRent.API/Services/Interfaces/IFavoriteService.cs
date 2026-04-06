using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Property;

namespace SmartRent.API.Services.Interfaces
{
    public interface IFavoriteService
    {
        Task<ServiceResult<bool>> ToggleFavoriteAsync(int userId, int propertyId);
        Task<ServiceResult<PagedResult<PropertyResponseDto>>> GetUserFavoritesAsync(int userId, PaginationDto pagination);
        Task<ServiceResult<bool>> IsFavoritedAsync(int userId, int propertyId);
    }
}
