using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Property;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public PropertyController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PaginationDto pagination)
        {
            // MOCK RESPONSE matching API Contract for frontend testing
            var mockProperties = new List<PropertyResponseDto>
            {
                new PropertyResponseDto
                {
                    Id = 1,
                    Title = "The Glass House Residency",
                    Description = "Experience the pinnacle of urban living...",
                    Price = 4500.00m,
                    Location = "88 Skyline Boulevard, West District",
                    PropertyType = "Apartment",
                    RentalStatus = "Available",
                    CreatedAt = DateTime.Parse("2026-04-01T10:00:00Z"),
                    Amenities = new PropertyAmenitiesDto { HasParking = true, HasElevator = true, IsFurnished = true, HasPool = false },
                    Images = new List<PropertyImageDto> { new PropertyImageDto { Id = 10, ImageUrl = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop", IsMain = true } },
                    Landlord = new PropertyLandlordDto { Id = 5, FullName = "Robert J. Sterling", PhoneNumber = "01012345678", ProfileImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
                    Rating = new PropertyRatingDto { AverageScore = 4.8m, TotalReviews = 24 },
                    IsFavorite = false
                },
                new PropertyResponseDto
                {
                    Id = 2,
                    Title = "Emerald Crest Villa",
                    Description = "Nestled on a lush hillside...",
                    Price = 8200.00m,
                    Location = "12 Emerald Ridge, Hillcrest Heights",
                    PropertyType = "Villa",
                    RentalStatus = "Available",
                    CreatedAt = DateTime.Parse("2026-03-28T14:30:00Z"),
                    Amenities = new PropertyAmenitiesDto { HasParking = true, HasElevator = false, IsFurnished = true, HasPool = true },
                    Images = new List<PropertyImageDto> { new PropertyImageDto { Id = 20, ImageUrl = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop", IsMain = true } },
                    Landlord = new PropertyLandlordDto { Id = 8, FullName = "Amara D. Fontaine", PhoneNumber = "01198765432", ProfileImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
                    Rating = new PropertyRatingDto { AverageScore = 4.9m, TotalReviews = 31 },
                    IsFavorite = true
                }
            };
            return Ok(mockProperties);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var mockProp = new PropertyResponseDto
            {
                Id = id,
                Title = "The Glass House Residency",
                Description = "Experience the pinnacle of urban living...",
                Price = 4500.00m,
                Location = "88 Skyline Boulevard, West District",
                PropertyType = "Apartment",
                RentalStatus = "Available",
                CreatedAt = DateTime.Parse("2026-04-01T10:00:00Z"),
                Amenities = new PropertyAmenitiesDto { HasParking = true, HasElevator = true, IsFurnished = true, HasPool = false },
                Images = new List<PropertyImageDto> { new PropertyImageDto { Id = 10, ImageUrl = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop", IsMain = true } },
                Landlord = new PropertyLandlordDto { Id = 5, FullName = "Robert J. Sterling", PhoneNumber = "01012345678", ProfileImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
                Rating = new PropertyRatingDto { AverageScore = 4.8m, TotalReviews = 24 },
                IsFavorite = false
            };
            return Ok(mockProp);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePropertyDto dto)
        {
            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePropertyDto dto)
        {
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok();
        }

        [HttpGet("landlord")]
        public async Task<IActionResult> GetByLandlord([FromQuery] PaginationDto pagination)
        {
            return await GetAll(pagination);
        }

        [HttpPost("{id}/images")]
        public async Task<IActionResult> UploadImages(int id)
        {
            return Ok();
        }
    }
}
