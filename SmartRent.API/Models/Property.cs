using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRent.API.Models
{
    public class Property
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(50)]
        public string PropertyType { get; set; } = string.Empty; // Apartment, House, Studio, Villa

        [Required]
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string State { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ZipCode { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MonthlyRent { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? SecurityDeposit { get; set; }

        public int Bedrooms { get; set; }

        public int Bathrooms { get; set; }

        public double? AreaSqFt { get; set; }

        public bool IsAvailable { get; set; } = true;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Active"; // Active, Rented, Inactive

        [Required]
        public int LandlordId { get; set; }

        [ForeignKey("LandlordId")]
        public User Landlord { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
        public ICollection<PropertyAmenity> Amenities { get; set; } = new List<PropertyAmenity>();
        public ICollection<VisitRequest> VisitRequests { get; set; } = new List<VisitRequest>();
        public ICollection<RentalApplication> RentalApplications { get; set; } = new List<RentalApplication>();
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
