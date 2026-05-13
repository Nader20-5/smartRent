using System.ComponentModel.DataAnnotations;

namespace SmartRent.API.DTOs.User
{
    public class UpdateProfileDto
    {
        [Required(ErrorMessage = "Full Name is required.")]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }
    }
}
