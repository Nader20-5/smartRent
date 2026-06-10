using SmartRent.API.Models;

namespace SmartRent.API.Repositories.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<User> Users { get; }
        IGenericRepository<Property> Properties { get; }
        IGenericRepository<PropertyImage> PropertyImages { get; }
        IGenericRepository<PropertyAmenity> PropertyAmenities { get; }
        IGenericRepository<VisitRequest> VisitRequests { get; }
        IGenericRepository<RentalApplication> RentalApplications { get; }
        IGenericRepository<ApplicationDocument> ApplicationDocuments { get; }
        IGenericRepository<Favorite> Favorites { get; }
        IGenericRepository<Review> Reviews { get; }
        IGenericRepository<Notification> Notifications { get; }
        Task<int> SaveChangesAsync();
    }
}
