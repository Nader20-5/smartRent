using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Property;

namespace SmartRent.API.Services.Interfaces
{
    public interface IPropertyService
    {
        Task<ServiceResult<PropertyResponseDto>> CreateAsync(int landlordId, CreatePropertyDto dto);
        Task<ServiceResult<PropertyResponseDto>> UpdateAsync(int landlordId, int propertyId, UpdatePropertyDto dto);
        Task<ServiceResult<bool>> DeleteAsync(int landlordId, int propertyId);
        Task<ServiceResult<PropertyResponseDto>> GetByIdAsync(int propertyId);
        Task<ServiceResult<PagedResult<PropertyResponseDto>>> GetAllAsync(PaginationDto pagination);
        Task<ServiceResult<PagedResult<PropertyResponseDto>>> GetByLandlordAsync(int landlordId, PaginationDto pagination);
        Task<ServiceResult<List<string>>> UploadImagesAsync(int landlordId, int propertyId, List<string> imagePaths);
    }
}
