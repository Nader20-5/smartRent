namespace SmartRent.API.DTOs.Visit
{
    public class VisitResponseDto
    {
        public int Id { get; set; }

        public int PropertyId { get; set; }

        public string PropertyTitle { get; set; } = string.Empty;

        public int TenantId { get; set; }

        public string TenantName { get; set; } = string.Empty;

        public DateTime RequestedDate { get; set; }

        public string? Message { get; set; }

        public string Status { get; set; } = string.Empty;

        public string? RejectionReason { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
