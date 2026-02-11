using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Helper.Enums;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class ShipmentRepository : IShipmentRepository
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IOrderRepository _orderRepository;
        public ShipmentRepository(Ecommerce3BROContext context, IOrderRepository orderRepository)
        {
            _context = context;
            _orderRepository = orderRepository;
        }
        public async Task<ApiResponse<ShipmentDTO>> AddNewShipmentAsync(ShipmentDTO shipmentDTO)
        {
            var newShipment = new Shipment()
            {
                CreatedDate = DateTime.Now,
                ShipperName = shipmentDTO.ShipperName,
                TrackingNumber = shipmentDTO.TrackingNumber,
                OrderId = shipmentDTO.OrderId,
                Status = 0
            };
            await _context.Shipment.AddAsync(newShipment);
            await _context.SaveChangesAsync();
            return new ApiResponse<ShipmentDTO>(null, shipmentDTO, "200", "Add new shipment successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<ShipmentDTO>> DeleteShipmentByIdAsync(Guid shipmentId)
        {
            var findShipment = await _context.Shipment.FindAsync(shipmentId);
            if (findShipment == null)
            {
                return new ApiResponse<ShipmentDTO>(null, null, "404", "Shipment not found", false, 0, 0, 0, 0, null, null, null);
            }
            _context.Shipment.Remove(findShipment);
            await _context.SaveChangesAsync();
            return new ApiResponse<ShipmentDTO>(null, null, "200", "Delete shipment successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetShipmentDTO>> GetAllShipmentByPageAsync(int currentPage, int pageSize)
        {
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;
            var totalItems = _context.Shipment.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var shipments = await _context.Shipment.OrderByDescending(s => s.CreatedDate)
                .Skip((currentPage - 1) * pageSize).Take(pageSize).Select(s => new GetShipmentDTO
                {
                    DeliveryDate = s.DeliveryDate,
                    Id = s.Id,
                    OrderId = s.OrderId,
                    ShipDate = s.ShipDate,
                    ShipperName = s.ShipperName,
                    Status = ((ShipmentStatus)s.Status).ToString(),
                    TrackingNumber = s.TrackingNumber
                }).ToListAsync();
            return new ApiResponse<GetShipmentDTO>(shipments, null, "200", "Get all shipments by page successfully", true, currentPage, pageSize, totalPages, totalItems, null, null, null);

        }

        public async Task<ApiResponse<GetShipmentDTO>> GetShipmentByStatusAsync(int status)
        {
            var shipments = await _context.Shipment.Where(s => s.Status == status).Select(s => new GetShipmentDTO
            {
                DeliveryDate = s.DeliveryDate,
                Id = s.Id,
                OrderId = s.OrderId,
                ShipDate = s.ShipDate,
                ShipperName = s.ShipperName,
                Status = ((ShipmentStatus)s.Status).ToString(),
                TrackingNumber = s.TrackingNumber
            }).ToListAsync();
            return new ApiResponse<GetShipmentDTO>(shipments, null, "200", "Get all shipments by status successfully", true, 0, 0, 0, 0, null, null, null);

        }

        public async Task<ApiResponse<GetShipmentDTO>> UpdateShipmentAsync(Guid shipmentId, UpdateShipmentDTO shipmentDTO)
        {
            var findShipment = await _context.Shipment.FindAsync(shipmentId);
            if (findShipment == null)
            {
                return new ApiResponse<GetShipmentDTO>(null, null, "400", "Shipment not found", false, 0, 0, 0, 0, null, null, null);
            }
            if (shipmentDTO.Status == 1)
            {
                findShipment.ShipDate = DateTime.UtcNow;
            }
            if (shipmentDTO.Status == 2)
            {
                findShipment.DeliveryDate = DateTime.UtcNow;
            }
            findShipment.Status = shipmentDTO.Status;
            findShipment.ShipperName = shipmentDTO.ShipperName;
            findShipment.TrackingNumber = shipmentDTO.TrackingNumber;
            var getShipment = new GetShipmentDTO
            {
                DeliveryDate = findShipment.DeliveryDate,
                Id = findShipment.Id,
                OrderId = findShipment.OrderId,
                ShipDate = findShipment.ShipDate,
                ShipperName = findShipment.ShipperName,
                Status = ((ShipmentStatus)findShipment.Status).ToString(),
                TrackingNumber = findShipment.TrackingNumber
            };
            if (findShipment.Status == 2)
            {
                await _orderRepository.UpdateOrderStatus(findShipment.OrderId, 3);
            }
            await _context.SaveChangesAsync();
            return new ApiResponse<GetShipmentDTO>(null, getShipment, "200", "Update shipment successfully", true, 0, 0, 0, 0, null, null, null);

        }
    }
}
