using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartRent.API.DTOs.Common;
using SmartRent.API.DTOs.Property;
using SmartRent.API.Services.Interfaces;

namespace SmartRent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public PropertyController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PaginationDto pagination)
        {
            // TODO: implement
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            // TODO: implement
            return Ok();
        }

        [HttpPost]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> Create([FromBody] CreatePropertyDto dto)
        {
            // TODO: implement
            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePropertyDto dto)
        {
            // TODO: implement
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> Delete(int id)
        {
            // TODO: implement
            return Ok();
        }

        [HttpGet("landlord")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> GetByLandlord([FromQuery] PaginationDto pagination)
        {
            // TODO: implement
            return Ok();
        }

        [HttpPost("{id}/images")]
        [Authorize(Roles = "Landlord")]
        public async Task<IActionResult> UploadImages(int id)
        {
            // TODO: implement
            return Ok();
        }
    }
}
