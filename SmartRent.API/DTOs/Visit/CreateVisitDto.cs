using System.ComponentModel.DataAnnotations;

namespace SmartRent.API.DTOs.Visit
{
    public class CreateVisitDto
    {
        [Required]
        public int PropertyId { get; set; }

        [Required]
        public DateTime RequestedDate { get; set; }

        [MaxLength(500)]
        public string? Message { get; set; }
    }
}
