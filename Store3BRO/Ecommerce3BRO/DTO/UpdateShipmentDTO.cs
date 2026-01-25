using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class UpdateShipmentDTO
    {
        [StringLength(100)]
        public string ShipperName { get; set; }

        [StringLength(100)]
        public string TrackingNumber { get; set; }

        public int Status { get; set; }
    }
}
