using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IShipmentRepository
    {
        Task<ApiResponse<ShipmentDTO>> AddNewShipmentAsync(Guid orderId);
        Task<ApiResponse<GetShipmentDTO>> UpdateShipmentAsync(Guid shipmentId, int status);
        Task<ApiResponse<ShipmentDTO>> DeleteShipmentByIdAsync(Guid shipmentId);
        Task<ApiResponse<GetShipmentDTO>> GetAllShipmentByPageAsync(int currentPage, int pageSize);
        Task<ApiResponse<GetShipmentDTO>> GetShipmentByStatusAsync(int status);
    }
}


