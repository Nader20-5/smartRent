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

        [Required(ErrorMessage = "Bedrooms is required.")]
        [Range(0, 100, ErrorMessage = "Bedrooms must be a positive number.")]
        public int Bedrooms { get; set; }

        [Required(ErrorMessage = "Baths is required.")]
        [Range(0, 100, ErrorMessage = "Baths must be a positive number.")]
        public int Baths { get; set; }

        [Required(ErrorMessage = "Area is required.")]
        [Range(1, double.MaxValue, ErrorMessage = "Area must be greater than zero.")]
        public decimal Area { get; set; }

        public int? Floor { get; set; }

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
