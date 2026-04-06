using System.ComponentModel.DataAnnotations;

namespace SmartRent.API.DTOs.Property
{
    public class UpdatePropertyDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }

        [MaxLength(50)]
        public string? PropertyType { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? State { get; set; }

        [MaxLength(20)]
        public string? ZipCode { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? MonthlyRent { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? SecurityDeposit { get; set; }

        [Range(0, 50)]
        public int? Bedrooms { get; set; }

        [Range(0, 50)]
        public int? Bathrooms { get; set; }

        [Range(0, double.MaxValue)]
        public double? AreaSqFt { get; set; }

        public bool? IsAvailable { get; set; }

        public List<string>? Amenities { get; set; }
    }
}
