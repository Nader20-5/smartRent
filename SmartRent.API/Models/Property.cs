using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRent.API.Models
{
    [Table("Properties")]
    public class Property
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Required]
        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string PropertyType { get; set; } = string.Empty; // Apartment, Villa, Studio, Office

        [Required]
        [MaxLength(20)]
        public string RentalStatus { get; set; } = "Available"; // Available, Rented, Pending

        public bool IsApproved { get; set; } = false;

        public bool IsActive { get; set; } = true;

        [Required]
        public int LandlordId { get; set; }

        [ForeignKey("LandlordId")]
        public User Landlord { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
        public PropertyAmenity? Amenity { get; set; }
        public ICollection<VisitRequest> VisitRequests { get; set; } = new List<VisitRequest>();
        public ICollection<RentalApplication> RentalApplications { get; set; } = new List<RentalApplication>();
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
