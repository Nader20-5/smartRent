using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Rental;
using SmartRent.API.Helpers;
using SmartRent.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using SmartRent.API.Models;
using Microsoft.AspNetCore.Http;

namespace SmartRent.API.Services.Implementations
{
    public class RentalService : IRentalService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly FileUploadHelper _fileUploadHelper;

        public RentalService(
            AppDbContext context,
            INotificationService notificationService,
            FileUploadHelper fileUploadHelper)
        {
            _context = context;
            _notificationService = notificationService;
            _fileUploadHelper = fileUploadHelper;
        }

        public async Task<ServiceResult<RentalResponseDto>> CreateAsync(int tenantId, CreateRentalDto dto)
        {
            try
            {
                var property = await _context.Properties
                    .FirstOrDefaultAsync(p => p.Id == dto.PropertyId && p.IsAvailable);

                if (property is null)
                    return ServiceResult<RentalResponseDto>.FailureResult("Property is not available or doesn't exist.");

                var application = new RentalApplication
                {
                    PropertyId = dto.PropertyId,
                    TenantId = tenantId,
                    CoverLetter = dto.CoverLetter,
                    ProposedRent = dto.ProposedRent,
                    MoveInDate = dto.MoveInDate,
                    Status = "Pending",
                    CreatedAt = DateTime.Now 
                };

                _context.RentalApplications.Add(application);

                await _context.SaveChangesAsync();

                List<string> uploadedUrls = new List<string>();
                if (dto.Documents?.Any() == true)
                {
                    uploadedUrls = await UploadDocumentsAndGetUrlsAsync(application.Id, dto.Documents, "Initial Submission");
                }

                try
                {
                    await _notificationService.CreateAsync(
                        userId: property.LandlordId,
                        title: "New Rental Application",
                        message: $"A new application has been submitted for: {property.Title}",
                        link: application.Id.ToString()
                    );
                }
                catch {  }

                var response = MapToResponseDto(application, property.Title, tenantId);
                response.DocumentUrls = uploadedUrls;

                return ServiceResult<RentalResponseDto>.SuccessResult(response);
            }
            catch (Exception ex)
            {
                return ServiceResult<RentalResponseDto>.FailureResult($"Error while creating application: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        private async Task<List<string>> UploadDocumentsAndGetUrlsAsync(
            int applicationId, IEnumerable<IFormFile> files, string documentType)
        {
            var urls = new List<string>();
            foreach (var file in files)
            {
                var fileUrl = await _fileUploadHelper.UploadFileAsync(file, "rentals/applications");
                urls.Add(fileUrl);

                _context.ApplicationDocuments.Add(new ApplicationDocument
                {
                    RentalApplicationId = applicationId,
                    DocumentName = file.FileName,
                    DocumentUrl = fileUrl,
                    DocumentType = documentType,
                    UploadedAt = DateTime.UtcNow
                });
            }
            await _context.SaveChangesAsync();
            return urls;
        }


        public async Task<ServiceResult<bool>> ApproveAsync(int landlordId, int applicationId)
        {
            try
            {
                var application = await _context.RentalApplications
                    .Include(a => a.Property) 
                    .FirstOrDefaultAsync(a => a.Id == applicationId);

                if (application is null)
                    return ServiceResult<bool>.FailureResult("Application not found.");

                if (application.Property.LandlordId != landlordId)
                    return ServiceResult<bool>.FailureResult("You are not authorized to approve this application.");

                if (application.Status != "Pending")
                    return ServiceResult<bool>.FailureResult($"Application is already {application.Status}.");

                application.Status = "Approved";
                application.UpdatedAt = DateTime.UtcNow;
                application.Property.IsAvailable = false;

                await RejectOtherPendingApplicationsAsync(application.PropertyId, applicationId);

                await _context.SaveChangesAsync();

                try
                {
                    await _notificationService.CreateAsync(
                        userId: application.TenantId,
                        title: "Application Approved!",
                        message: $"Congratulations! Your application for '{application.Property.Title}' has been approved.",
                        link: application.Id.ToString()
                    );
                }
                catch { }

                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"Error during approval: {ex.Message}");
            }
        }

        public async Task<ServiceResult<bool>> RejectAsync(int landlordId, int applicationId, RejectDto dto)
        {
            try
            {
                var application = await _context.RentalApplications
                    .Include(a => a.Property)
                    .FirstOrDefaultAsync(a => a.Id == applicationId);


                if (application is null)
                    return ServiceResult<bool>.FailureResult("Application not found.");

                if (application.Property.LandlordId != landlordId)
                    return ServiceResult<bool>.FailureResult("You are not authorized to reject this application.");

                application.Status = "Rejected";
                application.RejectionReason = dto.Reason;
                application.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                await _notificationService.CreateAsync(
                    userId: application.TenantId,
                    title: "Rental Application Update",
                    message: $"Unfortunately, your application for '{application.Property.Title}' was rejected. Reason: {dto.Reason}",
                    link: application.Id.ToString()
                );

                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult($"An error occurred during rejection: {ex.Message}");
            }
        }

        public async Task<ServiceResult<PagedResult<RentalResponseDto>>> GetByTenantAsync(int tenantId, PaginationDto pagination)
        {
            var query = _context.RentalApplications
                .Include(a => a.Property)
                .Include(a => a.Documents)
                .Where(a => a.TenantId == tenantId)
                .OrderByDescending(a => a.CreatedAt);

            var totalCount = await query.CountAsync();
            var applications = await query
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync();

            var items = applications.Select(a => MapToResponseDto(a, a.Property.Title, tenantId)).ToList();

            return ServiceResult<PagedResult<RentalResponseDto>>.SuccessResult(
                BuildPagedResult(items, totalCount, pagination));
        }

        public async Task<ServiceResult<PagedResult<RentalResponseDto>>> GetByLandlordAsync(int landlordId, PaginationDto pagination)
        {
            var query = _context.RentalApplications
                .Include(a => a.Property)
                .Include(a => a.Documents)
                .Include(a => a.Tenant)
                .Where(a => a.Property.LandlordId == landlordId)
                .OrderByDescending(a => a.CreatedAt);

            var totalCount = await query.CountAsync();
            var applications = await query
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync();

            var items = applications.Select(a => {
                var dto = MapToResponseDto(a, a.Property.Title, a.TenantId);
                dto.TenantName = a.Tenant.FirstName;
                return dto;
            }).ToList();

            return ServiceResult<PagedResult<RentalResponseDto>>.SuccessResult(
                BuildPagedResult(items, totalCount, pagination));
        }

        public async Task<ServiceResult<bool>> UploadAdditionalDocumentAsync(int tenantId, int applicationId, IFormFile file, string documentType)
        {
            var application = await _context.RentalApplications
                .FirstOrDefaultAsync(a => a.Id == applicationId && a.TenantId == tenantId);

            if (application is null)
                return ServiceResult<bool>.FailureResult("Rental application not found.");

            await UploadDocumentsAndGetUrlsAsync(application.Id, new[] { file }, documentType);
            return ServiceResult<bool>.SuccessResult(true);
        }


        private async Task RejectOtherPendingApplicationsAsync(int propertyId, int approvedApplicationId)
        {
            var otherApplications = await _context.RentalApplications
                .Where(a => a.PropertyId == propertyId && a.Id != approvedApplicationId && a.Status == "Pending")
                .ToListAsync();

            foreach (var app in otherApplications)
            {
                app.Status = "Rejected";
                app.RejectionReason = "Property has been rented to another applicant.";
                app.UpdatedAt = DateTime.UtcNow;
            }
        }

        private static RentalResponseDto MapToResponseDto(RentalApplication application, string propertyTitle, int tenantId)
        {
            return new RentalResponseDto
            {
                Id = application.Id,
                PropertyId = application.PropertyId,
                PropertyTitle = propertyTitle,
                TenantId = tenantId,
                Status = application.Status,
                ProposedRent = application.ProposedRent,
                MoveInDate = application.MoveInDate,
                CreatedAt = application.CreatedAt,
                DocumentUrls = application.Documents?.Select(d => d.DocumentUrl).ToList() ?? new List<string>()
            };
        }

        private static PagedResult<T> BuildPagedResult<T>(List<T> items, int totalCount, PaginationDto pagination)
        {
            return new PagedResult<T>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize
            };
        }
    }
}