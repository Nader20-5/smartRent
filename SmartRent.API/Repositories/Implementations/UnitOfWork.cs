using SmartRent.API.Data;
using SmartRent.API.Models;
using SmartRent.API.Repositories.Interfaces;

namespace SmartRent.API.Repositories.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        private IGenericRepository<User>? _users;
        private IGenericRepository<Property>? _properties;
        private IGenericRepository<PropertyImage>? _propertyImages;
        private IGenericRepository<PropertyAmenity>? _propertyAmenities;
        private IGenericRepository<VisitRequest>? _visitRequests;
        private IGenericRepository<RentalApplication>? _rentalApplications;
        private IGenericRepository<ApplicationDocument>? _applicationDocuments;
        private IGenericRepository<Favorite>? _favorites;
        private IGenericRepository<Review>? _reviews;
        private IGenericRepository<Notification>? _notifications;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<User> Users =>
            _users ??= new GenericRepository<User>(_context);

        public IGenericRepository<Property> Properties =>
            _properties ??= new GenericRepository<Property>(_context);

        public IGenericRepository<PropertyImage> PropertyImages =>
            _propertyImages ??= new GenericRepository<PropertyImage>(_context);

        public IGenericRepository<PropertyAmenity> PropertyAmenities =>
            _propertyAmenities ??= new GenericRepository<PropertyAmenity>(_context);

        public IGenericRepository<VisitRequest> VisitRequests =>
            _visitRequests ??= new GenericRepository<VisitRequest>(_context);

        public IGenericRepository<RentalApplication> RentalApplications =>
            _rentalApplications ??= new GenericRepository<RentalApplication>(_context);

        public IGenericRepository<ApplicationDocument> ApplicationDocuments =>
            _applicationDocuments ??= new GenericRepository<ApplicationDocument>(_context);

        public IGenericRepository<Favorite> Favorites =>
            _favorites ??= new GenericRepository<Favorite>(_context);

        public IGenericRepository<Review> Reviews =>
            _reviews ??= new GenericRepository<Review>(_context);

        public IGenericRepository<Notification> Notifications =>
            _notifications ??= new GenericRepository<Notification>(_context);

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
