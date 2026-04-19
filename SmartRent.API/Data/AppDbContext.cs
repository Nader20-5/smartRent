using Microsoft.EntityFrameworkCore;
using SmartRent.API.Models;

namespace SmartRent.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<PropertyImage> PropertyImages { get; set; }
        public DbSet<PropertyAmenity> PropertyAmenities { get; set; }
        public DbSet<VisitRequest> VisitRequests { get; set; }
        public DbSet<RentalApplication> RentalApplications { get; set; }
        public DbSet<ApplicationDocument> ApplicationDocuments { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User constraints
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
            });

            // Property constraints
            modelBuilder.Entity<Property>(entity =>
            {
                entity.HasOne(p => p.Landlord)
                      .WithMany(u => u.Properties)
                      .HasForeignKey(p => p.LandlordId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.Property(p => p.Price).HasColumnType("decimal(10,2)");
            });

            // PropertyImage constraints
            modelBuilder.Entity<PropertyImage>(entity =>
            {
                entity.HasOne(pi => pi.Property)
                      .WithMany(p => p.Images)
                      .HasForeignKey(pi => pi.PropertyId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // PropertyAmenity constraints — one-to-one with Property
            modelBuilder.Entity<PropertyAmenity>(entity =>
            {
                entity.HasIndex(pa => pa.PropertyId).IsUnique();

                entity.HasOne(pa => pa.Property)
                      .WithOne(p => p.Amenity)
                      .HasForeignKey<PropertyAmenity>(pa => pa.PropertyId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // VisitRequest constraints
            modelBuilder.Entity<VisitRequest>(entity =>
            {
                entity.HasOne(v => v.Property)
                      .WithMany(p => p.VisitRequests)
                      .HasForeignKey(v => v.PropertyId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(v => v.Tenant)
                      .WithMany(u => u.VisitRequests)
                      .HasForeignKey(v => v.TenantId)
                      .OnDelete(DeleteBehavior.NoAction);
            });

            // RentalApplication constraints
            modelBuilder.Entity<RentalApplication>(entity =>
            {
                entity.HasOne(r => r.Property)
                      .WithMany(p => p.RentalApplications)
                      .HasForeignKey(r => r.PropertyId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(r => r.Tenant)
                      .WithMany(u => u.RentalApplications)
                      .HasForeignKey(r => r.TenantId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.Property(r => r.ProposedRent).HasColumnType("decimal(10,2)");
            });

            // ApplicationDocument constraints
            modelBuilder.Entity<ApplicationDocument>(entity =>
            {
                entity.HasOne(d => d.RentalApplication)
                      .WithMany(r => r.Documents)
                      .HasForeignKey(d => d.RentalApplicationId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Favorite constraints — unique composite key
            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasIndex(f => new { f.UserId, f.PropertyId }).IsUnique();

                entity.HasOne(f => f.User)
                      .WithMany(u => u.Favorites)
                      .HasForeignKey(f => f.UserId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(f => f.Property)
                      .WithMany(p => p.Favorites)
                      .HasForeignKey(f => f.PropertyId)
                      .OnDelete(DeleteBehavior.NoAction);
            });

            // Review constraints
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasOne(r => r.Property)
                      .WithMany(p => p.Reviews)
                      .HasForeignKey(r => r.PropertyId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(r => r.Tenant)
                      .WithMany(u => u.Reviews)
                      .HasForeignKey(r => r.TenantId)
                      .OnDelete(DeleteBehavior.NoAction);

                entity.HasIndex(r => new { r.TenantId, r.PropertyId }).IsUnique();
            });

            // Notification constraints
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasOne(n => n.User)
                      .WithMany(u => u.Notifications)
                      .HasForeignKey(n => n.UserId)
                      .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}
