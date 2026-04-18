using System.ComponentModel.DataAnnotations;

namespace SmartRent.API.DTOs.Common
{
    public class RejectDto
    {
        [Required]
        [MaxLength(500)]
        public string Reason { get; set; } = string.Empty;
    }
}
