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

        [MaxLength(500)]
        public string? Location { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal? Price { get; set; }

        [Range(0, 100, ErrorMessage = "Bedrooms must be a positive number.")]
        public int? Bedrooms { get; set; }

        [Range(0, 100, ErrorMessage = "Baths must be a positive number.")]
        public int? Baths { get; set; }

        [Range(1, double.MaxValue, ErrorMessage = "Area must be greater than zero.")]
        public decimal? Area { get; set; }

        public int? Floor { get; set; }

        public string? RentalStatus { get; set; }

        // Amenities
        public bool? HasParking { get; set; }
        public bool? HasElevator { get; set; }
        public bool? IsFurnished { get; set; }
        public bool? HasPool { get; set; }
    }
}
