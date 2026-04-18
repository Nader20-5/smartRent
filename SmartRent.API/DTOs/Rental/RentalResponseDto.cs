namespace SmartRent.API.DTOs.Rental
{
    public class RentalResponseDto
    {
        public int Id { get; set; }
        public int PropertyId { get; set; }
        public string PropertyTitle { get; set; } = string.Empty;
        public int TenantId { get; set; }
        public string? TenantName { get; set; } 
        public string Status { get; set; } = string.Empty;
        public string? CoverLetter { get; set; }
        public decimal? ProposedRent { get; set; }
        public DateTime? MoveInDate { get; set; }
        public string? RejectionReason { get; set; }

        public List<string> DocumentUrls { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }
}