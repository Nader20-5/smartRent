using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Visit;
using SmartRent.API.Models;
using SmartRent.API.Repositories.Interfaces;
using SmartRent.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SmartRent.API.Services.Implementations
{
    public static class VisitStatus
    {
        public const string Pending = "Pending";
        public const string Approved = "Approved";
        public const string Rejected = "Rejected";
        public const string Cancelled = "Cancelled";
    }

    public class VisitService : IVisitService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly INotificationService _notificationService;

        public VisitService(IUnitOfWork unitOfWork, INotificationService notificationService)
        {
            _unitOfWork = unitOfWork;
            _notificationService = notificationService;
        }

        // Maps visit request to DTO
        private static VisitResponseDto MapToDto(VisitRequest v) => new()
        {
            Id = v.Id,
            PropertyId = v.PropertyId,
            PropertyTitle = v.Property?.Title ?? string.Empty,
            PropertyLocation = v.Property?.Location ?? string.Empty,
            TenantId = v.TenantId,
            TenantName = v.Tenant?.Email ?? string.Empty,
            RequestedDate = v.RequestedDate,
            Status = v.Status,
            Message = v.Message,
            PropertyImageUrl = v.Property?.Images?.FirstOrDefault(i => i.IsMain)?.ImageUrl 
                              ?? v.Property?.Images?.FirstOrDefault()?.ImageUrl,
            CreatedAt = v.CreatedAt
        };

        // Ensures valid pagination parameter values
        private static void NormalizePagination(PaginationDto pagination)
        {
            if (pagination.PageNumber < 1) pagination.PageNumber = 1;
            if (pagination.PageSize < 1) pagination.PageSize = 10;
            if (pagination.PageSize > 100) pagination.PageSize = 100;
        }

        // Creates a new visit request
        public async Task<ServiceResult<VisitResponseDto>> CreateAsync(int tenantId, CreateVisitDto dto)
        {
            try
            {
                var visitRequest = new VisitRequest
                {
                    TenantId = tenantId,
                    PropertyId = dto.PropertyId,
                    RequestedDate = dto.RequestedDate,
                    Message = dto.Message,
                    Status = VisitStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };

                await _unitOfWork.VisitRequests.AddAsync(visitRequest);
                await _unitOfWork.SaveChangesAsync();

                var property = await _unitOfWork.Properties
                    .FirstOrDefaultAsync(p => p.Id == dto.PropertyId);

                if (property != null)
                {
                    await _notificationService.CreateAsync(
                        property.LandlordId,
                        "New Visit Request",
                        $"You have a new visit request for the property: {property.Title}",
                        "VisitRequest",
                        "/landlord/visits" 
                    );
                }

                return ServiceResult<VisitResponseDto>.SuccessResult(MapToDto(visitRequest));
            }
            catch (Exception ex)
            {
                return ServiceResult<VisitResponseDto>.FailureResult("Request creation error: " + ex.Message);
            }
        }

        // Approves an existing visit request
        public async Task<ServiceResult<bool>> ApproveAsync(int landlordId, int visitId)
        {
            try
            {
                var visit = await _unitOfWork.VisitRequests.Query()
                    .Include(v => v.Property)
                    .FirstOrDefaultAsync(v => v.Id == visitId && v.Property.LandlordId == landlordId);

                if (visit == null)
                    return ServiceResult<bool>.FailureResult("The visit request does not exist or you do not have the authority to modify it.");

                if (visit.Status != VisitStatus.Pending)
                    return ServiceResult<bool>.FailureResult("Only pending requests can be approved.");

                visit.Status = VisitStatus.Approved;
                visit.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.SaveChangesAsync();

                await _notificationService.CreateAsync(
                    visit.TenantId,
                    "Visit Approved",
                    $"Great news! Your visit request for property '{visit.Property.Title}' has been approved by the landlord.",
                    "VisitStatusUpdate", 
                    $"/tenant/visits/{visit.Id}" 
                );

                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult("An error occurred while approving the request: " + ex.Message);
            }
        }

        // Rejects an existing visit request
        public async Task<ServiceResult<bool>> RejectAsync(int landlordId, int visitId, RejectDto dto)
        {
            try
            {
                var visit = await _unitOfWork.VisitRequests.Query()
                    .Include(v => v.Property)
                    .FirstOrDefaultAsync(v => v.Id == visitId && v.Property.LandlordId == landlordId);

                if (visit == null)
                    return ServiceResult<bool>.FailureResult("Request not found.");

                if (visit.Status != VisitStatus.Pending)
                    return ServiceResult<bool>.FailureResult("Only pending requests can be rejected.");

                visit.Status = VisitStatus.Rejected;
                visit.LandlordNote = dto.Reason;
                visit.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.SaveChangesAsync();

                await _notificationService.CreateAsync(
                    visit.TenantId,
                    "Visit Request Rejected",
                    $"Your visit request for '{visit.Property.Title}' has been rejected. Reason: {dto.Reason}",
                    "VisitStatusUpdate",
                    $"/tenant/visits/{visit.Id}"
                );

                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult("An error occurred while rejecting the request: " + ex.Message);
            }
        }


        // Cancels a pending visit request
        public async Task<ServiceResult<bool>> CancelAsync(int tenantId, int visitId)
        {
            try
            {
                var visit = await _unitOfWork.VisitRequests
                    .FirstOrDefaultAsync(v => v.Id == visitId && v.TenantId == tenantId);

                if (visit == null)
                    return ServiceResult<bool>.FailureResult("Visit request not found.");

                if (visit.Status != VisitStatus.Pending)
                    return ServiceResult<bool>.FailureResult("Only pending requests can be cancelled.");

                visit.Status = VisitStatus.Cancelled;
                visit.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.SaveChangesAsync();
                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult("An error occurred while cancelling the request: " + ex.Message);
            }
        }

        // Retrieves visit requests for tenant
        public async Task<ServiceResult<PagedResult<VisitResponseDto>>> GetByTenantAsync(int tenantId, PaginationDto pagination)
        {
            try
            {
                NormalizePagination(pagination); 

                var query = _unitOfWork.VisitRequests.Query()
                    .Include(v => v.Property)
                        .ThenInclude(p => p.Images)
                    .Where(v => v.TenantId == tenantId)
                    .OrderByDescending(v => v.CreatedAt);

                var totalCount = await query.CountAsync();

                var items = await query
                    .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                    .Take(pagination.PageSize)
                    .Select(v => MapToDto(v))  
                    .ToListAsync();

                var result = new PagedResult<VisitResponseDto>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = pagination.PageNumber,
                    PageSize = pagination.PageSize
                };

                return ServiceResult<PagedResult<VisitResponseDto>>.SuccessResult(result);
            }
            catch (Exception ex)
            {
                return ServiceResult<PagedResult<VisitResponseDto>>.FailureResult("An error occurred: " + ex.Message);
            }
        }

        // Retrieves visit requests for landlord
        public async Task<ServiceResult<PagedResult<VisitResponseDto>>> GetByLandlordAsync(int landlordId, PaginationDto pagination)
        {
            try
            {
                NormalizePagination(pagination); 

                var query = _unitOfWork.VisitRequests.Query()
                    .Include(v => v.Property)
                        .ThenInclude(p => p.Images)
                    .Include(v => v.Tenant)
                    .Where(v => v.Property.LandlordId == landlordId)
                    .OrderByDescending(v => v.CreatedAt);

                var totalCount = await query.CountAsync();

                var items = await query
                    .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                    .Take(pagination.PageSize)
                    .Select(v => MapToDto(v))  
                    .ToListAsync();

                var result = new PagedResult<VisitResponseDto>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = pagination.PageNumber,
                    PageSize = pagination.PageSize
                };

                return ServiceResult<PagedResult<VisitResponseDto>>.SuccessResult(result);
            }
            catch (Exception ex)
            {
                return ServiceResult<PagedResult<VisitResponseDto>>.FailureResult("An error occurred while fetching incoming orders: " + ex.Message);
            }
        }
    }
}