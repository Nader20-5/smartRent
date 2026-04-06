using System.ComponentModel.DataAnnotations;

namespace SmartRent.API.DTOs.Rental
{
    public class CreateRentalDto
    {
        [Required]
        public int PropertyId { get; set; }

        [MaxLength(1000)]
        public string? CoverLetter { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? ProposedRent { get; set; }

        public DateTime? MoveInDate { get; set; }
    }
}
