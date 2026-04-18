using System.ComponentModel.DataAnnotations;

namespace SmartRent.API.DTOs.Review
{
    public class CreateReviewDto
    {
        [Required(ErrorMessage = "PropertyId is required.")]
        public int PropertyId { get; set; }

        [Required(ErrorMessage = "Rating is required.")]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }

        [MaxLength(1000, ErrorMessage = "Comment must not exceed 1000 characters.")]
        public string? Comment { get; set; }
    }
}
