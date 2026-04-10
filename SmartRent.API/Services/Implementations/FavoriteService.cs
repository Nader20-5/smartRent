using Microsoft.EntityFrameworkCore;
using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Property;
using SmartRent.API.Models;
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

        public async Task<ServiceResult<bool>> AddFavoriteAsync(int userId, int propertyId)
        {
            try
            {
                var propertyExists = await _context.Properties.AnyAsync(p => p.Id == propertyId);
                if (!propertyExists)
                    return ServiceResult<bool>.FailureResult("Property not found.");

                var alreadyFavorited = await _context.Favorites
                    .AnyAsync(f => f.UserId == userId && f.PropertyId == propertyId);

                if (alreadyFavorited)
                    return ServiceResult<bool>.FailureResult("Property is already in your favorites.");

                _context.Favorites.Add(new Favorite
                {
                    UserId = userId,
                    PropertyId = propertyId,
                    CreatedAt = DateTime.UtcNow
                });
                await _context.SaveChangesAsync();

                return ServiceResult<bool>.SuccessResult(true, "Property added to favorites.");
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"Failed to add favorite: {ex.Message}");
            }
        }

        public async Task<ServiceResult<bool>> RemoveFavoriteAsync(int userId, int propertyId)
        {
            try
            {
                var favorite = await _context.Favorites
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);

                if (favorite == null)
                    return ServiceResult<bool>.FailureResult("Property is not in your favorites.");

                _context.Favorites.Remove(favorite);
                await _context.SaveChangesAsync();

                return ServiceResult<bool>.SuccessResult(true, "Property removed from favorites.");
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"Failed to remove favorite: {ex.Message}");
            }
        }

        public async Task<ServiceResult<List<PropertyResponseDto>>> GetUserFavoritesAsync(int userId)
        {
            try
            {
                var favoritePropertyIds = await _context.Favorites
                    .Where(f => f.UserId == userId)
                    .OrderByDescending(f => f.CreatedAt)
                    .Select(f => f.PropertyId)
                    .ToListAsync();

                var dtos = new List<PropertyResponseDto>();

                foreach (var propertyId in favoritePropertyIds)
                {
                    var property = await _context.Properties
                        .Include(p => p.Landlord)
                        .Include(p => p.Images)
                        .Include(p => p.Amenity)
                        .Include(p => p.Reviews)
                        .FirstOrDefaultAsync(p => p.Id == propertyId);

                    if (property == null) continue;

                    dtos.Add(MapToResponseDto(property, isFavorite: true));
                }

                return ServiceResult<List<PropertyResponseDto>>.SuccessResult(dtos);
            }
            catch (Exception ex)
            {
                return ServiceResult<List<PropertyResponseDto>>.FailureResult($"Failed to retrieve favorites: {ex.Message}");
            }
        }

        public async Task<ServiceResult<bool>> IsFavoritedAsync(int userId, int propertyId)
        {
            try
            {
                var favorited = await _context.Favorites
                    .AnyAsync(f => f.UserId == userId && f.PropertyId == propertyId);
                return ServiceResult<bool>.SuccessResult(favorited);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"Failed to check favorite status: {ex.Message}");
            }
        }

        public async Task<ServiceResult<bool>> ToggleFavoriteAsync(int userId, int propertyId)
        {
            var isFavorited = await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.PropertyId == propertyId);
            return isFavorited
                ? await RemoveFavoriteAsync(userId, propertyId)
                : await AddFavoriteAsync(userId, propertyId);
        }

        public async Task<ServiceResult<PagedResult<PropertyResponseDto>>> GetUserFavoritesAsync(int userId, PaginationDto pagination)
        {
            var result = await GetUserFavoritesAsync(userId);
            if (!result.Success)
                return ServiceResult<PagedResult<PropertyResponseDto>>.FailureResult(result.Message!);

            var items = result.Data ?? new List<PropertyResponseDto>();
            var paged = new PagedResult<PropertyResponseDto>
            {
                Items = items.Skip((pagination.PageNumber - 1) * pagination.PageSize).Take(pagination.PageSize).ToList(),
                TotalCount = items.Count,
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize
            };
            return ServiceResult<PagedResult<PropertyResponseDto>>.SuccessResult(paged);
        }

        private static PropertyResponseDto MapToResponseDto(Property property, bool isFavorite)
        {
            double avgScore = 0;
            int totalReviews = property.Reviews.Count;
            if (totalReviews > 0)
                avgScore = Math.Round(property.Reviews.Average(r => r.Rating), 1);

            return new PropertyResponseDto
            {
                Id           = property.Id,
                Title        = property.Title,
                Description  = property.Description,
                Price        = property.Price,
                Location     = property.Location,
                PropertyType = property.PropertyType,
                RentalStatus = property.RentalStatus,
                CreatedAt    = property.CreatedAt,
                IsFavorite   = isFavorite,
                IsApproved   = property.IsApproved,
                IsActive     = property.IsActive,
                Amenities = new PropertyAmenitiesDto
                {
                    HasParking  = property.Amenity?.HasParking ?? false,
                    HasElevator = property.Amenity?.HasElevator ?? false,
                    IsFurnished = property.Amenity?.IsFurnished ?? false,
                    HasPool     = property.Amenity?.HasPool ?? false
                },
                Images = property.Images.Select(img => new PropertyImageDto
                {
                    Id       = img.Id,
                    ImageUrl = img.ImageUrl,
                    IsMain   = img.IsMain
                }).ToList(),
                Landlord = new PropertyLandlordDto
                {
                    Id           = property.Landlord.Id,
                    FullName     = property.Landlord.FullName,
                    PhoneNumber  = property.Landlord.PhoneNumber,
                    ProfileImage = property.Landlord.ProfileImage
                },
                Rating = new PropertyRatingDto
                {
                    AverageScore = avgScore,
                    TotalReviews = totalReviews
                }
            };
        }
    }
}
