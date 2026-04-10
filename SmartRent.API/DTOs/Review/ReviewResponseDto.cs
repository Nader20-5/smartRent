namespace SmartRent.API.DTOs.Review
{
    public class ReviewResponseDto
    {
        public int Id { get; set; }
        public int PropertyId { get; set; }
        public int TenantId { get; set; }
        public string TenantFullName { get; set; } = string.Empty;
        public string? TenantProfileImage { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
