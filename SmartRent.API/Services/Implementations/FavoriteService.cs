using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Property;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{
    public class FavoriteService : IFavoriteService
    {
        private readonly AppDbContext _context;

        public FavoriteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResult<bool>> ToggleFavoriteAsync(int userId, int propertyId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PagedResult<PropertyResponseDto>>> GetUserFavoritesAsync(int userId, PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> IsFavoritedAsync(int userId, int propertyId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }
    }
}
