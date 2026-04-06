namespace SmartRent.API.DTOs.Property
{
    public class PropertyResponseDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string PropertyType { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string State { get; set; } = string.Empty;

        public string ZipCode { get; set; } = string.Empty;

        public decimal MonthlyRent { get; set; }

        public decimal? SecurityDeposit { get; set; }

        public int Bedrooms { get; set; }

        public int Bathrooms { get; set; }

        public double? AreaSqFt { get; set; }

        public bool IsAvailable { get; set; }

        public string Status { get; set; } = string.Empty;

        public int LandlordId { get; set; }

        public string LandlordName { get; set; } = string.Empty;

        public List<string> Images { get; set; } = new();

        public List<string> Amenities { get; set; } = new();

        public double AverageRating { get; set; }

        public int ReviewCount { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
