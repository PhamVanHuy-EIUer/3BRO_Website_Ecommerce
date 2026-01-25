using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class GetShipmentDTO
    {
        [Key]
        public Guid Id { get; set; }

        public Guid OrderId { get; set; }

        [StringLength(100)]
        public string ShipperName { get; set; }

        [StringLength(100)]
        public string TrackingNumber { get; set; }

        public DateTime? ShipDate { get; set; }

        public DateTime? DeliveryDate { get; set; }

        public string Status { get; set; }

    }
}
