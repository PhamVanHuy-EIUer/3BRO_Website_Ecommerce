using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
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
        public async Task<ApiResponse<GetShipmentDTO>> GetShipmentByPage([FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            var result = await _shipmentService.GetAllShipmentByPageAsync(currentPage, pageSize);
            return result;
        }
        [HttpPost]
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
        public async Task<ApiResponse<ShipmentDTO>> DeleteShipment([FromRoute] Guid id)
        {
            var result = await _shipmentService.DeleteShipmentByIdAsync(id);
            return result;
        }
        [HttpGet("by-status")]
        public async Task<ApiResponse<GetShipmentDTO>> GetShipmentByStatus([FromQuery] int status)
        {
            var result = await _shipmentService.GetShipmentByStatusAsync(status);
            return result;
        }
    }
}
