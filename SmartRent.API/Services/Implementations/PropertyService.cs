using SmartRent.API.Data;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Property;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Services.Implementations
{
    public class PropertyService : IPropertyService
    {
        private readonly AppDbContext _context;

        public PropertyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResult<PropertyResponseDto>> CreateAsync(int landlordId, CreatePropertyDto dto)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PropertyResponseDto>> UpdateAsync(int landlordId, int propertyId, UpdatePropertyDto dto)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> DeleteAsync(int landlordId, int propertyId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PropertyResponseDto>> GetByIdAsync(int propertyId)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PagedResult<PropertyResponseDto>>> GetAllAsync(PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<PagedResult<PropertyResponseDto>>> GetByLandlordAsync(int landlordId, PaginationDto pagination)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<List<string>>> UploadImagesAsync(int landlordId, int propertyId, List<string> imagePaths)
        {
            // TODO: implement
            throw new NotImplementedException();
        }
    }
}
