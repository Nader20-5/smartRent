namespace SmartRent.API.DTOs.Favorite
{
    /// <summary>
    /// Represents a favorited property entry for a tenant.
    /// </summary>
    public class FavoriteResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PropertyId { get; set; }
        public DateTime CreatedAt { get; set; }

        /// <summary>Full property details embedded in the favorite response</summary>
        public DTOs.Property.PropertyResponseDto Property { get; set; } = null!;
    }
}
