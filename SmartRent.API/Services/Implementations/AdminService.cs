using Microsoft.EntityFrameworkCore;
using SmartRent.API.DTOs.Common;
using SmartRent.API.Models;
using SmartRent.API.Repositories.Interfaces;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly INotificationService _notificationService;

        public AdminService(IUnitOfWork unitOfWork, INotificationService notificationService)
        {
            _unitOfWork = unitOfWork;
            _notificationService = notificationService;
        }

        public async Task<ServiceResult<PagedResult<User>>> GetAllUsersAsync(PaginationDto pagination)
        {
            var query = _unitOfWork.Users.Query();
            var totalItems = await query.CountAsync();
            var items = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync();

            var result = new PagedResult<User>
            {
                Items = items,
                TotalCount = totalItems,
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize
            };

            return ServiceResult<PagedResult<User>>.SuccessResult(result);
        }

        public async Task<ServiceResult<bool>> ToggleUserStatusAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
            {
                return ServiceResult<bool>.FailureResult("User not found.");
            }

            user.IsActive = !user.IsActive;
            await _unitOfWork.SaveChangesAsync();
            return ServiceResult<bool>.SuccessResult(true, "User status updated.");
        }

        public async Task<ServiceResult<object>> GetDashboardStatsAsync()
        {
            var totalUsers = await _unitOfWork.Users.CountAsync();
            var activeLandlords = await _unitOfWork.Users.CountAsync(u => u.Role == "Landlord" && u.IsActive && u.IsApproved);
            var totalProperties = await _unitOfWork.Properties.CountAsync();
            
            var pendingLandlords = await _unitOfWork.Users.CountAsync(u => u.Role == "Landlord" && !u.IsApproved && u.IsActive);
            var pendingProperties = await _unitOfWork.Properties.CountAsync(p => !p.IsApproved && p.IsActive);
            var pendingApprovals = pendingLandlords + pendingProperties;

            var stats = new
            {
                TotalUsers = totalUsers,
                ActiveLandlords = activeLandlords,
                TotalProperties = totalProperties,
                PendingApprovals = pendingApprovals
            };

            return ServiceResult<object>.SuccessResult(stats);
        }
        
        public async Task<IEnumerable<object>> GetPendingLandlordsAsync()
        {
            return await _unitOfWork.Users.Query()
                .Where(u => u.Role == "Landlord" && !u.IsApproved && u.IsActive)
                .Select(u => new { 
                    id = u.Id, 
                    email = u.Email, 
                    fullName = u.FullName, 
                    phoneNumber = u.PhoneNumber, 
                    createdAt = u.CreatedAt, 
                    profileImage = u.ProfileImage 
                })
                .ToListAsync();
        }

        public async Task<bool> ApproveLandlordAsync(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null || user.Role != "Landlord") return false;
            
            user.IsApproved = true;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectLandlordAsync(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null || user.Role != "Landlord") return false;

            user.IsActive = false; // "Rejection" means it's inactive
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<object>> GetAllPropertiesAsync(PaginationDto pagination)
        {
            return await _unitOfWork.Properties.Query()
                .Include(p => p.Landlord)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .Select(p => new {
                    id = p.Id,
                    title = p.Title,
                    location = p.Location,
                    price = p.Price,
                    propertyType = p.PropertyType,
                    rentalStatus = p.RentalStatus,
                    isApproved = p.IsApproved,
                    isActive = p.IsActive,
                    landlord = new { fullName = p.Landlord!.FullName, id = p.Landlord.Id }
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<object>> GetPendingPropertiesAsync()
        {
            return await _unitOfWork.Properties.Query()
                .Include(p => p.Landlord)
                .Where(p => !p.IsApproved && p.IsActive)
                .Select(p => new {
                    id = p.Id,
                    title = p.Title,
                    location = p.Location,
                    price = p.Price,
                    propertyType = p.PropertyType,
                    landlord = new { fullName = p.Landlord!.FullName }
                })
                .ToListAsync();
        }

        public async Task<bool> ApprovePropertyAsync(int id)
        {
            var property = await _unitOfWork.Properties.GetByIdAsync(id);
            if (property == null) return false;

            property.IsApproved = true;
            await _unitOfWork.SaveChangesAsync();

            // Notify landlord about property approval
            try 
            {
                await _notificationService.CreateAsync(
                    property.LandlordId,
                    "Property Approved",
                    $"Your property '{property.Title}' has been approved and is now live.",
                    "PropertyApproval",
                    $"/properties/{property.Id}"
                );
            }
            catch { /* non-blocking */ }

            return true;
        }

        public async Task<bool> RejectPropertyAsync(int id)
        {
            var property = await _unitOfWork.Properties.GetByIdAsync(id);
            if (property == null) return false;

            property.IsActive = false; // Hide from public
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
