using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportsController : Controller
    {
        private readonly ISupportRepository _supportService;
        public SupportsController(ISupportRepository supportService)
        {
            _supportService = supportService;
        }
        [HttpGet]
        [Authorize(Roles ="Admin")]
        public Task<ApiResponse<GetSupportDTO>> GetAllContact()
        {
            return _supportService.GetAllUserContactAsync();
        }
        [HttpGet("by-page")]
        [Authorize(Roles = "Admin")]
        public Task<ApiResponse<GetSupportDTO>> GetAllContactPyPage([FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            return _supportService.GetAllUserContactPyPagesAsync(currentPage, pageSize);
        }
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public Task<ApiResponse<Support>> GetSupportDetail([FromRoute] Guid id)
        {
            return _supportService.GetContactDetailAsync(id);
        }
        [HttpPost]
        [Authorize]
        public async Task<ApiResponse<GetSupportDTO>> AddNewContact([FromBody] SupportDTO support)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetSupportDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            return await _supportService.AddNewContactAsync(support);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetSupportDTO>> DeleteContact([FromRoute] Guid id) { 
           return await _supportService.DeleteContactAsync(id);
        }
        [HttpPost("response")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<Support>> SendResponseToCustomer([FromBody] ResponseDTO response)
        {
            return await _supportService.SendResponeAsync(response);
        }
    }
}
