using System.ComponentModel.DataAnnotations;

namespace SmartRent.API.DTOs.Property
{
    public class CreatePropertyDto
    {
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required(ErrorMessage = "Property type is required.")]
        [MaxLength(50)]
        public string PropertyType { get; set; } = string.Empty; // Apartment, Villa, Studio, Office

        [Required(ErrorMessage = "Location is required.")]
        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal Price { get; set; }

        // Amenities
        public bool HasParking { get; set; } = false;
        public bool HasElevator { get; set; } = false;
        public bool IsFurnished { get; set; } = false;
        public bool HasPool { get; set; } = false;

        /// <summary>
        /// Images to upload — first file will be set as main
        /// </summary>
        public List<IFormFile>? Images { get; set; }
    }
}
