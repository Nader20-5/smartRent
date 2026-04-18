using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace SmartRent.API.DTOs.Rental
{
    public class CreateRentalDto
    {
        [Required(ErrorMessage = "Property ID is required.")]
        public int PropertyId { get; set; }

        [MaxLength(1000, ErrorMessage = "Cover letter cannot exceed 1000 characters.")]
        public string? CoverLetter { get; set; }

        [Range(0, 1000000, ErrorMessage = "Proposed rent must be a realistic positive value.")]
        public decimal? ProposedRent { get; set; }

        [DataType(DataType.Date)]
        public DateTime? MoveInDate { get; set; }

        [Required(ErrorMessage = "Please upload at least one supporting document (ID, Salary, etc.).")]
        public List<IFormFile> Documents { get; set; } = new List<IFormFile>();
    }
}