using System.ComponentModel.DataAnnotations;

namespace SmartRent.API.DTOs.Property
{
    public class UpdatePropertyDto
    {
        [MaxLength(150)]
        public string? Title { get; set; }

        public string? Description { get; set; }

        [MaxLength(50)]
        public string? PropertyType { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal? Price { get; set; }

        // Amenities
        public bool? HasParking { get; set; }
        public bool? HasElevator { get; set; }
        public bool? IsFurnished { get; set; }
        public bool? HasPool { get; set; }
    }
}
