using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRent.API.Models
{
    public class ApplicationDocument
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int RentalApplicationId { get; set; }

        [ForeignKey("RentalApplicationId")]
        public virtual RentalApplication RentalApplication { get; set; } = null!;

        [Required]
        [MaxLength(200)]
        public string DocumentName { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string DocumentUrl { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? DocumentType { get; set; } 
        public DateTime UploadedAt { get; set; } = DateTime.Now;
    }
}