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
        public string? Location { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? Price { get; set; }

        public string? RentalStatus { get; set; }

        // Amenities
        public bool? HasParking { get; set; }
        public bool? HasElevator { get; set; }
        public bool? IsFurnished { get; set; }
        public bool? HasPool { get; set; }
    }
}
