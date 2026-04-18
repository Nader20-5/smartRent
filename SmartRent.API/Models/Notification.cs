using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRent.API.Models
{
    [Table("Notifications")]
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Message { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public int? RelatedId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? Link { get; set; }

    }
}
