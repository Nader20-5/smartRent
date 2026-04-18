using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRent.API.Models
{
    [Table("ApplicationDocuments")]
    public class ApplicationDocument
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("ApplicationId")]
        public int RentalApplicationId { get; set; }

        [ForeignKey("RentalApplicationId")]
        public RentalApplication RentalApplication { get; set; } = null!;

        [Required]
        [MaxLength(500)]
        public string DocumentUrl { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? DocumentType { get; set; } // NationalId, SalaryProof, BankStatement

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
