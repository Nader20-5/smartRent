namespace SmartRent.API.DTOs.Property
{
    /// <summary>
    /// Full property response matching the exact frontend JSON contract.
    /// </summary>
    public class PropertyResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string Location { get; set; } = string.Empty;
        public string PropertyType { get; set; } = string.Empty;
        public string RentalStatus { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsFavorite { get; set; }
        public bool IsApproved { get; set; }
        public bool IsActive { get; set; }
        public PropertyAmenitiesDto Amenities { get; set; } = new();
        public List<PropertyImageDto> Images { get; set; } = new();
        public PropertyLandlordDto Landlord { get; set; } = new();
        public PropertyRatingDto Rating { get; set; } = new();
    }

    public class PropertyAmenitiesDto
    {
        public bool HasParking { get; set; }
        public bool HasElevator { get; set; }
        public bool IsFurnished { get; set; }
        public bool HasPool { get; set; }
    }

    public class PropertyImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsMain { get; set; }
    }

    public class PropertyLandlordDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? ProfileImage { get; set; }
    }

    public class PropertyRatingDto
    {
        public double AverageScore { get; set; }
        public int TotalReviews { get; set; }
    }
}
