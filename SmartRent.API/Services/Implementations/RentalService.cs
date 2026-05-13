using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Rental;
using SmartRent.API.Helpers;
using SmartRent.API.Repositories.Interfaces;
using SmartRent.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using SmartRent.API.Models;
using Microsoft.AspNetCore.Http;

namespace SmartRent.API.Services.Implementations
{
    public class RentalService : IRentalService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly INotificationService _notificationService;
        private readonly FileUploadHelper _fileUploadHelper;

        public RentalService(
            IUnitOfWork unitOfWork,
            INotificationService notificationService,
            FileUploadHelper fileUploadHelper)
        {
            _unitOfWork = unitOfWork;
            _notificationService = notificationService;
            _fileUploadHelper = fileUploadHelper;
        }

        // Creates a new rental application
        public async Task<ServiceResult<RentalResponseDto>> CreateAsync(int tenantId, CreateRentalDto dto)
        {
            try
            {
                var property = await _unitOfWork.Properties
                    .FirstOrDefaultAsync(p => p.Id == dto.PropertyId && p.IsActive);

                if (property is null)
                    return ServiceResult<RentalResponseDto>.FailureResult("Property is not available or doesn't exist.");

                var moveIn = dto.MoveInDate ?? DateTime.UtcNow;
                var leaseEnd = dto.LeaseEndDate;

                if (leaseEnd.HasValue)
                {
                    var hasOverlap = await _unitOfWork.RentalApplications.AnyAsync(a =>
                        a.PropertyId == dto.PropertyId && a.Status == "Approved" &&
                        a.LeaseEndDate != null && a.MoveInDate < leaseEnd.Value && a.LeaseEndDate > moveIn);

                    if (hasOverlap)
                        return ServiceResult<RentalResponseDto>.FailureResult(
                            "This property is already booked for the requested dates. Please choose different dates.");
                }

                var application = new RentalApplication
                {
                    PropertyId = dto.PropertyId, TenantId = tenantId, CoverLetter = dto.CoverLetter,
                    ProposedRent = dto.ProposedRent ?? 0m, MoveInDate = moveIn, LeaseEndDate = leaseEnd,
                    Status = "Pending", CreatedAt = DateTime.Now
                };

                await _unitOfWork.RentalApplications.AddAsync(application);
                await _unitOfWork.SaveChangesAsync();

                List<string> uploadedUrls = new List<string>();
                if (dto.Documents?.Any() == true)
                    uploadedUrls = await UploadDocumentsAndGetUrlsAsync(application.Id, dto.Documents, "Initial Submission");

                try
                {
                    await _notificationService.CreateAsync(
                        userId: property.LandlordId, title: "New Rental Application",
                        message: $"A new rental application has been submitted for: {property.Title}",
                        type: "RentalApplication", link: "/landlord/rentals");
                }
                catch { }

                var response = MapToResponseDto(application, property, tenantId);
                response.DocumentUrls = uploadedUrls;
                return ServiceResult<RentalResponseDto>.SuccessResult(response);
            }
            catch (Exception ex)
            {
                return ServiceResult<RentalResponseDto>.FailureResult($"Error while creating application: {ex.InnerException?.Message ?? ex.Message}");
            }
        }
        // Uploads documents and returns URLs
        private async Task<List<string>> UploadDocumentsAndGetUrlsAsync(
            int applicationId, IEnumerable<IFormFile> files, string documentType)
        {
            var urls = new List<string>();
            foreach (var file in files)
            {
                var fileUrl = await _fileUploadHelper.UploadFileAsync(file, "uploads/rentals/applications", encrypt: true);
                urls.Add(fileUrl);
                await _unitOfWork.ApplicationDocuments.AddAsync(new ApplicationDocument
                {
                    RentalApplicationId = applicationId, DocumentUrl = fileUrl,
                    DocumentType = documentType, UploadedAt = DateTime.UtcNow
                });
            }
            await _unitOfWork.SaveChangesAsync();
            return urls;
        }

        // Approves a rental application request
        public async Task<ServiceResult<bool>> ApproveAsync(int landlordId, int applicationId)
        {
            try
            {
                var application = await _unitOfWork.RentalApplications.Query()
                    .Include(a => a.Property)
                    .FirstOrDefaultAsync(a => a.Id == applicationId);

                if (application is null) return ServiceResult<bool>.FailureResult("Application not found.");
                if (application.Property.LandlordId != landlordId) return ServiceResult<bool>.FailureResult("You are not authorized to approve this application.");
                if (application.Status != "Pending") return ServiceResult<bool>.FailureResult($"Application is already {application.Status}.");

                if (application.LeaseEndDate.HasValue)
                {
                    var hasOverlap = await _unitOfWork.RentalApplications.AnyAsync(a =>
                        a.PropertyId == application.PropertyId && a.Id != applicationId && a.Status == "Approved" &&
                        a.LeaseEndDate != null && a.MoveInDate < application.LeaseEndDate.Value && a.LeaseEndDate > application.MoveInDate);
                    if (hasOverlap)
                        return ServiceResult<bool>.FailureResult("Cannot approve — this property already has an approved rental for overlapping dates.");
                }

                application.Status = "Approved";
                application.UpdatedAt = DateTime.UtcNow;
                await RejectOverlappingPendingApplicationsAsync(application);
                await _unitOfWork.SaveChangesAsync();

                try
                {
                    await _notificationService.CreateAsync(
                        userId: application.TenantId, title: "Application Approved!",
                        message: $"Congratulations! Your application for '{application.Property.Title}' has been approved.",
                        type: "RentalApproval", link: "/my-applications");
                }
                catch { }

                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"Error during approval: {ex.Message}");
            }
        }

        // Rejects a rental application request
        public async Task<ServiceResult<bool>> RejectAsync(int landlordId, int applicationId, RejectDto dto)
        {
            try
            {
                var application = await _unitOfWork.RentalApplications.Query()
                    .Include(a => a.Property)
                    .FirstOrDefaultAsync(a => a.Id == applicationId);

                if (application is null) return ServiceResult<bool>.FailureResult("Application not found.");
                if (application.Property.LandlordId != landlordId) return ServiceResult<bool>.FailureResult("You are not authorized to reject this application.");

                application.Status = "Rejected";
                application.RejectionReason = dto.Reason;
                application.UpdatedAt = DateTime.UtcNow;
                await _unitOfWork.SaveChangesAsync();

                try
                {
                    await _notificationService.CreateAsync(
                        userId: application.TenantId, title: "Rental Application Update",
                        message: $"Unfortunately, your application for '{application.Property.Title}' was rejected. Reason: {dto.Reason}",
                        type: "RentalRejection", link: "/my-applications");
                }
                catch { }

                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"An error occurred during rejection: {ex.Message}");
            }
        }

        // Retrieves applications for a tenant
        public async Task<ServiceResult<PagedResult<RentalResponseDto>>> GetByTenantAsync(int tenantId, PaginationDto pagination)
        {
            var query = _unitOfWork.RentalApplications.Query()
                .Include(a => a.Property).ThenInclude(p => p.Images)
                .Include(a => a.Documents)
                .Where(a => a.TenantId == tenantId)
                .OrderByDescending(a => a.CreatedAt);

            var totalCount = await query.CountAsync();
            var applications = await query
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize).ToListAsync();

            var items = applications.Select(a => MapToResponseDto(a, a.Property, tenantId)).ToList();
            return ServiceResult<PagedResult<RentalResponseDto>>.SuccessResult(BuildPagedResult(items, totalCount, pagination));
        }

        // Retrieves applications for a landlord
        public async Task<ServiceResult<PagedResult<RentalResponseDto>>> GetByLandlordAsync(int landlordId, PaginationDto pagination)
        {
            var query = _unitOfWork.RentalApplications.Query()
                .Include(a => a.Property).ThenInclude(p => p.Images)
                .Include(a => a.Documents).Include(a => a.Tenant)
                .Where(a => a.Property.LandlordId == landlordId)
                .OrderByDescending(a => a.CreatedAt);

            var totalCount = await query.CountAsync();
            var applications = await query
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize).ToListAsync();

            var items = applications.Select(a =>
            {
                var dto = MapToResponseDto(a, a.Property, a.TenantId);
                dto.TenantName = a.Tenant.FullName;
                return dto;
            }).ToList();

            return ServiceResult<PagedResult<RentalResponseDto>>.SuccessResult(BuildPagedResult(items, totalCount, pagination));
        }

        // Rejects conflicting pending rental applications
        private async Task RejectOverlappingPendingApplicationsAsync(RentalApplication approved)
        {
            var pendingApps = await _unitOfWork.RentalApplications.Query()
                .Include(a => a.Property)
                .Where(a => a.PropertyId == approved.PropertyId && a.Id != approved.Id && a.Status == "Pending")
                .ToListAsync();

            foreach (var app in pendingApps)
            {
                bool overlaps = false;
                if (approved.LeaseEndDate.HasValue && app.LeaseEndDate.HasValue)
                    overlaps = app.MoveInDate < approved.LeaseEndDate.Value && app.LeaseEndDate > approved.MoveInDate;
                else
                    overlaps = true;

                if (overlaps)
                {
                    app.Status = "Rejected";
                    app.RejectionReason = "Property has been rented to another applicant for overlapping dates.";
                    app.UpdatedAt = DateTime.UtcNow;
                    try
                    {
                        await _notificationService.CreateAsync(
                            userId: app.TenantId, title: "Rental Application Update",
                            message: $"The property '{app.Property.Title}' is no longer available for your requested dates as it has been rented to another applicant.",
                            type: "RentalRejection", link: "/my-applications");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Notification failed for User {app.TenantId}: {ex.Message}");
                        continue;
                    }
                }
            }
        }

        // Maps application to response DTO
        private static RentalResponseDto MapToResponseDto(RentalApplication application, Property? property, int tenantId)
        {
            return new RentalResponseDto
            {
                Id = application.Id, PropertyId = application.PropertyId,
                PropertyTitle = property?.Title ?? "N/A", TenantId = tenantId,
                Status = application.Status, ProposedRent = application.ProposedRent,
                MoveInDate = application.MoveInDate, LeaseEndDate = application.LeaseEndDate,
                CoverLetter = application.CoverLetter, RejectionReason = application.RejectionReason,
                PropertyLocation = property?.Location ?? "N/A",
                PropertyImageUrl = property?.Images?.FirstOrDefault(i => i.IsMain)?.ImageUrl
                                  ?? property?.Images?.FirstOrDefault()?.ImageUrl,
                CreatedAt = application.CreatedAt,
                DocumentUrls = application.Documents?.Select(d => d.DocumentUrl).ToList() ?? new List<string>()
            };
        }

        // Builds a paged result object
        private static PagedResult<T> BuildPagedResult<T>(List<T> items, int totalCount, PaginationDto pagination)
        {
            return new PagedResult<T>
            {
                Items = items, TotalCount = totalCount,
                PageNumber = pagination.PageNumber, PageSize = pagination.PageSize
            };
        }

        // Uploads additional document to application
        public async Task<ServiceResult<bool>> UploadAdditionalDocumentAsync(int tenantId, int applicationId, IFormFile file, string documentType)
        {
            try
            {
                var application = await _unitOfWork.RentalApplications
                    .FirstOrDefaultAsync(a => a.Id == applicationId && a.TenantId == tenantId);

                if (application == null) return ServiceResult<bool>.FailureResult("Rental application not found.");

                var fileUrl = await _fileUploadHelper.UploadFileAsync(file, "uploads/rentals/applications", encrypt: true);
                await _unitOfWork.ApplicationDocuments.AddAsync(new ApplicationDocument
                {
                    RentalApplicationId = applicationId, DocumentUrl = fileUrl,
                    DocumentType = documentType, UploadedAt = DateTime.UtcNow
                });

                await _unitOfWork.SaveChangesAsync();
                return ServiceResult<bool>.SuccessResult(true, "Document uploaded successfully.");
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"Failed to upload document: {ex.Message}");
            }
        }
    }
}