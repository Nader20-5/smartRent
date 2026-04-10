using Microsoft.EntityFrameworkCore;
using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Property;
using SmartRent.API.Helpers;
using SmartRent.API.Models;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{
    public class PropertyService : IPropertyService
    {
        private readonly AppDbContext _context;
        private readonly FileUploadHelper _fileUploadHelper;

        public PropertyService(AppDbContext context, FileUploadHelper fileUploadHelper)
        {
            _context = context;
            _fileUploadHelper = fileUploadHelper;
        }

        // ─────────────────────────────────────────────────────────────────────
        // CREATE
        // ─────────────────────────────────────────────────────────────────────
        public async Task<ServiceResult<PropertyResponseDto>> CreateAsync(int landlordId, CreatePropertyDto dto)
        {
            try
            {
                var property = new Property
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    PropertyType = dto.PropertyType,
                    Location = dto.Location,
                    Price = dto.Price,
                    RentalStatus = "Available",
                    IsApproved = false,     // Admin must approve
                    IsActive = true,
                    LandlordId = landlordId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Properties.Add(property);
                await _context.SaveChangesAsync();

                // Amenity row (one per property)
                var amenity = new PropertyAmenity
                {
                    PropertyId = property.Id,
                    HasParking = dto.HasParking,
                    HasElevator = dto.HasElevator,
                    IsFurnished = dto.IsFurnished,
                    HasPool = dto.HasPool
                };
                _context.PropertyAmenities.Add(amenity);

                // Images
                if (dto.Images != null && dto.Images.Any())
                {
                    var urls = await _fileUploadHelper.UploadPropertyImagesAsync(dto.Images, property.Id);
                    bool isFirst = true;
                    foreach (var url in urls)
                    {
                        _context.PropertyImages.Add(new PropertyImage
                        {
                            PropertyId = property.Id,
                            ImageUrl = url,
                            IsMain = isFirst,
                            CreatedAt = DateTime.UtcNow
                        });
                        isFirst = false;
                    }
                }

                await _context.SaveChangesAsync();

                var responseDto = await BuildPropertyResponseDtoAsync(property.Id, null);
                return ServiceResult<PropertyResponseDto>.SuccessResult(responseDto!, "Property created successfully. Pending admin approval.");
            }
            catch (Exception ex)
            {
                return ServiceResult<PropertyResponseDto>.FailureResult($"Failed to create property: {ex.Message}");
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // UPDATE
        // ─────────────────────────────────────────────────────────────────────
        public async Task<ServiceResult<PropertyResponseDto>> UpdateAsync(int landlordId, int propertyId, UpdatePropertyDto dto)
        {
            try
            {
                var existingProperty = await _context.Properties
                    .Include(p => p.Amenity)
                    .FirstOrDefaultAsync(p => p.Id == propertyId);

                if (existingProperty == null)
                    return ServiceResult<PropertyResponseDto>.FailureResult("Property not found.");

                if (existingProperty.LandlordId != landlordId)
                    return ServiceResult<PropertyResponseDto>.FailureResult("Unauthorized: You do not own this property.");

                if (!string.IsNullOrWhiteSpace(dto.Title))         existingProperty.Title = dto.Title;
                if (dto.Description != null)                       existingProperty.Description = dto.Description;
                if (!string.IsNullOrWhiteSpace(dto.PropertyType))  existingProperty.PropertyType = dto.PropertyType;
                if (!string.IsNullOrWhiteSpace(dto.Location))      existingProperty.Location = dto.Location;
                if (dto.Price.HasValue)                             existingProperty.Price = dto.Price.Value;
                existingProperty.UpdatedAt = DateTime.UtcNow;

                // Amenities — update existing or create
                if (existingProperty.Amenity != null)
                {
                    if (dto.HasParking.HasValue)  existingProperty.Amenity.HasParking = dto.HasParking.Value;
                    if (dto.HasElevator.HasValue) existingProperty.Amenity.HasElevator = dto.HasElevator.Value;
                    if (dto.IsFurnished.HasValue) existingProperty.Amenity.IsFurnished = dto.IsFurnished.Value;
                    if (dto.HasPool.HasValue)     existingProperty.Amenity.HasPool = dto.HasPool.Value;
                }
                else
                {
                    _context.PropertyAmenities.Add(new PropertyAmenity
                    {
                        PropertyId = propertyId,
                        HasParking = dto.HasParking ?? false,
                        HasElevator = dto.HasElevator ?? false,
                        IsFurnished = dto.IsFurnished ?? false,
                        HasPool = dto.HasPool ?? false
                    });
                }

                await _context.SaveChangesAsync();

                var responseDto = await BuildPropertyResponseDtoAsync(propertyId, null);
                return ServiceResult<PropertyResponseDto>.SuccessResult(responseDto!, "Property updated successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<PropertyResponseDto>.FailureResult($"Failed to update property: {ex.Message}");
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // DELETE (soft)
        // ─────────────────────────────────────────────────────────────────────
        public async Task<ServiceResult<bool>> DeleteAsync(int landlordId, int propertyId)
        {
            try
            {
                var existingProperty = await _context.Properties
                    .FirstOrDefaultAsync(p => p.Id == propertyId);

                if (existingProperty == null)
                    return ServiceResult<bool>.FailureResult("Property not found.");

                if (existingProperty.LandlordId != landlordId)
                    return ServiceResult<bool>.FailureResult("Unauthorized: You do not own this property.");

                existingProperty.IsActive = false;
                existingProperty.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return ServiceResult<bool>.SuccessResult(true, "Property deleted successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"Failed to delete property: {ex.Message}");
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET BY ID
        // ─────────────────────────────────────────────────────────────────────
        public async Task<ServiceResult<PropertyResponseDto>> GetByIdAsync(int propertyId, int? currentUserId = null)
        {
            try
            {
                var responseDto = await BuildPropertyResponseDtoAsync(propertyId, currentUserId);
                if (responseDto == null)
                    return ServiceResult<PropertyResponseDto>.FailureResult("Property not found.");

                return ServiceResult<PropertyResponseDto>.SuccessResult(responseDto);
            }
            catch (Exception ex)
            {
                return ServiceResult<PropertyResponseDto>.FailureResult($"Failed to retrieve property: {ex.Message}");
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET ALL (public, filtered — IsApproved + IsActive only)
        // ─────────────────────────────────────────────────────────────────────
        public async Task<ServiceResult<List<PropertyResponseDto>>> GetAllAsync(
            string? location,
            string? propertyType,
            decimal? minPrice,
            decimal? maxPrice,
            int? currentUserId = null)
        {
            try
            {
                var query = _context.Properties
                    .Where(p => p.IsActive && p.IsApproved);

                if (!string.IsNullOrWhiteSpace(location))
                    query = query.Where(p => p.Location.Contains(location));

                if (!string.IsNullOrWhiteSpace(propertyType))
                    query = query.Where(p => p.PropertyType == propertyType);

                if (minPrice.HasValue)
                    query = query.Where(p => p.Price >= minPrice.Value);

                if (maxPrice.HasValue)
                    query = query.Where(p => p.Price <= maxPrice.Value);

                var propertyIds = await query
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => p.Id)
                    .ToListAsync();

                var dtos = new List<PropertyResponseDto>();
                foreach (var id in propertyIds)
                {
                    var dto = await BuildPropertyResponseDtoAsync(id, currentUserId);
                    if (dto != null) dtos.Add(dto);
                }

                return ServiceResult<List<PropertyResponseDto>>.SuccessResult(dtos);
            }
            catch (Exception ex)
            {
                return ServiceResult<List<PropertyResponseDto>>.FailureResult($"Failed to retrieve properties: {ex.Message}");
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET BY LANDLORD (all — regardless of approval / active status)
        // ─────────────────────────────────────────────────────────────────────
        public async Task<ServiceResult<List<PropertyResponseDto>>> GetByLandlordAsync(int landlordId)
        {
            try
            {
                var propertyIds = await _context.Properties
                    .Where(p => p.LandlordId == landlordId)
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => p.Id)
                    .ToListAsync();

                var dtos = new List<PropertyResponseDto>();
                foreach (var id in propertyIds)
                {
                    var dto = await BuildPropertyResponseDtoAsync(id, landlordId);
                    if (dto != null) dtos.Add(dto);
                }

                return ServiceResult<List<PropertyResponseDto>>.SuccessResult(dtos);
            }
            catch (Exception ex)
            {
                return ServiceResult<List<PropertyResponseDto>>.FailureResult($"Failed to retrieve landlord properties: {ex.Message}");
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // UPLOAD IMAGES
        // ─────────────────────────────────────────────────────────────────────
        public async Task<ServiceResult<List<string>>> UploadImagesAsync(int landlordId, int propertyId, List<IFormFile> images)
        {
            try
            {
                var existingProperty = await _context.Properties
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id == propertyId);

                if (existingProperty == null)
                    return ServiceResult<List<string>>.FailureResult("Property not found.");

                if (existingProperty.LandlordId != landlordId)
                    return ServiceResult<List<string>>.FailureResult("Unauthorized: You do not own this property.");

                bool hasExistingMain = existingProperty.Images.Any(i => i.IsMain);
                var urls = await _fileUploadHelper.UploadPropertyImagesAsync(images, propertyId);

                bool isFirst = true;
                foreach (var url in urls)
                {
                    _context.PropertyImages.Add(new PropertyImage
                    {
                        PropertyId = propertyId,
                        ImageUrl = url,
                        IsMain = isFirst && !hasExistingMain,
                        CreatedAt = DateTime.UtcNow
                    });
                    isFirst = false;
                }

                await _context.SaveChangesAsync();
                return ServiceResult<List<string>>.SuccessResult(urls, "Images uploaded successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<List<string>>.FailureResult($"Failed to upload images: {ex.Message}");
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // PRIVATE — Build full DTO
        // ─────────────────────────────────────────────────────────────────────
        private async Task<PropertyResponseDto?> BuildPropertyResponseDtoAsync(int propertyId, int? currentUserId)
        {
            var property = await _context.Properties
                .Include(p => p.Landlord)
                .Include(p => p.Images)
                .Include(p => p.Amenity)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.Id == propertyId);

            if (property == null) return null;

            bool isFavorite = false;
            if (currentUserId.HasValue)
            {
                isFavorite = await _context.Favorites
                    .AnyAsync(f => f.UserId == currentUserId.Value && f.PropertyId == propertyId);
            }

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
