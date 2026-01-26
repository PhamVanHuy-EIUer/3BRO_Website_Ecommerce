using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShipmentsController : Controller
    {
        private readonly IShipmentRepository _shipmentService;
        public ShipmentsController(IShipmentRepository shipmentService) { 
          _shipmentService = shipmentService;
        }
        [HttpGet("by-page")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetShipmentDTO>> GetShipmentByPage([FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            var result = await _shipmentService.GetAllShipmentByPageAsync(currentPage, pageSize);
            return result;
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<ShipmentDTO>> AddNewShipment([FromBody] ShipmentDTO shipment)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<ShipmentDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var result = await _shipmentService.AddNewShipmentAsync(shipment);
            return result;
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetShipmentDTO>> UpdateShipment([FromRoute] Guid id, [FromBody] UpdateShipmentDTO shipment)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetShipmentDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var result = await _shipmentService.UpdateShipmentAsync(id, shipment);
            return result;
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<ShipmentDTO>> DeleteShipment([FromRoute] Guid id)
        {
            var result = await _shipmentService.DeleteShipmentByIdAsync(id);
            return result;
        }
        [HttpGet("by-status")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetShipmentDTO>> GetShipmentByStatus([FromQuery] int status)
        {
            var result = await _shipmentService.GetShipmentByStatusAsync(status);
            return result;
        }
    }
}
