using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartRent.API.Models
{
    [Table("PropertyAmenities")]
    public class PropertyAmenity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PropertyId { get; set; }

        [ForeignKey("PropertyId")]
        public Property Property { get; set; } = null!;

        public bool HasParking { get; set; } = false;

        public bool HasElevator { get; set; } = false;

        public bool IsFurnished { get; set; } = false;

        public bool HasPool { get; set; } = false;
    }
}
