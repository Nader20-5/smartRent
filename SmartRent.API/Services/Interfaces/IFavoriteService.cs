using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Property;

namespace SmartRent.API.Services.Interfaces
{
    public interface IFavoriteService
    {
        /// <summary>Adds a property to the tenant's favorites. Returns false if already favorited.</summary>
        Task<ServiceResult<bool>> AddFavoriteAsync(int userId, int propertyId);

        /// <summary>Removes a property from the tenant's favorites.</summary>
        Task<ServiceResult<bool>> RemoveFavoriteAsync(int userId, int propertyId);

        /// <summary>Returns all favorited properties for the given tenant (with isFavorite = true).</summary>
        Task<ServiceResult<List<PropertyResponseDto>>> GetUserFavoritesAsync(int userId);

        /// <summary>Returns true if the tenant has favorited the property.</summary>
        Task<ServiceResult<bool>> IsFavoritedAsync(int userId, int propertyId);

        // Kept for backward-compat with existing interface calls
        Task<ServiceResult<bool>> ToggleFavoriteAsync(int userId, int propertyId);
        Task<ServiceResult<PagedResult<PropertyResponseDto>>> GetUserFavoritesAsync(int userId, PaginationDto pagination);
    }
}
