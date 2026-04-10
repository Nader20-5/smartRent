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
        public string Location { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        public string RentalStatus { get; set; } = string.Empty;

        // Amenities
        public bool HasParking { get; set; }
        public bool HasElevator { get; set; }
        public bool IsFurnished { get; set; }
        public bool HasPool { get; set; }
    }
}
