using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Property;

namespace SmartRent.API.Services.Interfaces
{
    public interface IPropertyService
    {
        /// <summary>Creates a new property (IsApproved defaults to false).</summary>
        Task<ServiceResult<PropertyResponseDto>> CreateAsync(int landlordId, CreatePropertyDto dto);

        /// <summary>Updates an existing property — validates the landlord owns it.</summary>
        Task<ServiceResult<PropertyResponseDto>> UpdateAsync(int landlordId, int propertyId, UpdatePropertyDto dto);

        /// <summary>Soft-deletes a property (IsAvailable = false, Status = "Inactive") — validates ownership.</summary>
        Task<ServiceResult<bool>> DeleteAsync(int landlordId, int propertyId);

        /// <summary>
        /// Returns a single property by ID.
        /// currentUserId is optional — when provided the isFavorite flag is resolved.
        /// </summary>
        Task<ServiceResult<PropertyResponseDto>> GetByIdAsync(int propertyId, int? currentUserId = null);

        /// <summary>
        /// Returns all approved + active properties with optional filters.
        /// currentUserId is optional — when provided the isFavorite flag is resolved.
        /// </summary>
        Task<ServiceResult<List<PropertyResponseDto>>> GetAllAsync(
            string? location,
            string? propertyType,
            decimal? minPrice,
            decimal? maxPrice,
            int? currentUserId = null);

        /// <summary>Returns ALL properties belonging to the landlord (ignores IsApproved/IsActive).</summary>
        Task<ServiceResult<List<PropertyResponseDto>>> GetByLandlordAsync(int landlordId);

        /// <summary>
        /// Uploads images for an existing property — the first image becomes primary.
        /// Validates the landlord owns the property.
        /// </summary>
        Task<ServiceResult<List<string>>> UploadImagesAsync(int landlordId, int propertyId, List<IFormFile> images);
    }
}
