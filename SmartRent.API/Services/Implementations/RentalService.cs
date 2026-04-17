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

        public RentalService(AppDbContext context, INotificationService notificationService, FileUploadHelper fileUploadHelper)
        {
            _context = context;
            _notificationService = notificationService;
            _fileUploadHelper = fileUploadHelper;
        }

        public async Task<ServiceResult<RentalResponseDto>> CreateAsync(int tenantId, CreateRentalDto dto)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> ApproveAsync(int landlordId, int applicationId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> RejectAsync(int landlordId, int applicationId, RejectDto dto)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PagedResult<RentalResponseDto>>> GetByTenantAsync(int tenantId, PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PagedResult<RentalResponseDto>>> GetByLandlordAsync(int landlordId, PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> UploadAdditionalDocumentAsync(int tenantId, int applicationId, IFormFile file, string documentType)
        {
            try
            {
                var application = await _context.RentalApplications
                    .FirstOrDefaultAsync(a => a.Id == applicationId && a.TenantId == tenantId);

                if (application == null)
                    return ServiceResult<bool>.FailureResult("Rental application not found.");

                string fileUrl = await _fileUploadHelper.UploadFileAsync(file, "rentals/additional");

                var document = new ApplicationDocument
                {
                    RentalApplicationId = application.Id,
                    DocumentName = file.FileName,
                    DocumentUrl = fileUrl,
                    DocumentType = documentType,
                    UploadedAt = DateTime.UtcNow
                };

                _context.ApplicationDocuments.Add(document);
                await _context.SaveChangesAsync();

                return ServiceResult<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return ServiceResult<bool>.FailureResult("Upload failed: " + ex.Message);
            }
        }
    }
}
