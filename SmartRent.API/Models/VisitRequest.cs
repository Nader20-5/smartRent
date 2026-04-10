using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRent.API.Models
{
    [Table("VisitRequests")]
    public class VisitRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PropertyId { get; set; }

        [ForeignKey("PropertyId")]
        public Property Property { get; set; } = null!;

        [Required]
        public int TenantId { get; set; }

        [ForeignKey("TenantId")]
        public User Tenant { get; set; } = null!;

        [Required]
        public DateTime RequestedDate { get; set; }

        [MaxLength(500)]
        public string? Message { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected, Cancelled

        [MaxLength(500)]
        public string? LandlordNote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
