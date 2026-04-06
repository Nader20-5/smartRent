using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRent.API.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Message { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Type { get; set; } // Visit, Rental, System, etc.

        public bool IsRead { get; set; } = false;

        [MaxLength(500)]
        public string? Link { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
