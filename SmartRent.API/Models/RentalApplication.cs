using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRent.API.Models
{
    public class RentalApplication
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PropertyId { get; set; }

        [ForeignKey("PropertyId")]
        public virtual Property Property { get; set; } = null!;

        [Required]
        public int TenantId { get; set; }

        [ForeignKey("TenantId")]
        public virtual User Tenant { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending"; 

        [MaxLength(1000)]
        public string? CoverLetter { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ProposedRent { get; set; }

        public DateTime? MoveInDate { get; set; }

        [MaxLength(500)]
        public string? RejectionReason { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<ApplicationDocument> Documents { get; set; } = new List<ApplicationDocument>();
    }
}