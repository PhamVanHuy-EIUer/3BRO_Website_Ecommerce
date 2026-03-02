using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class ShipmentDTO
    {
        public Guid OrderId { get; set; }

        public string ShipperName { get; set; }
        public string TrackingNumber { get; set; }

    }
}
