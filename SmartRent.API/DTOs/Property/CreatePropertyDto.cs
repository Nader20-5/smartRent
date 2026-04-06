using System.ComponentModel.DataAnnotations;

namespace SmartRent.API.DTOs.Property
{
    public class CreatePropertyDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(50)]
        public string PropertyType { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string State { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ZipCode { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal MonthlyRent { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? SecurityDeposit { get; set; }

        [Range(0, 50)]
        public int Bedrooms { get; set; }

        [Range(0, 50)]
        public int Bathrooms { get; set; }

        [Range(0, double.MaxValue)]
        public double? AreaSqFt { get; set; }

        public List<string>? Amenities { get; set; }
    }
}
