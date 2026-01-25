using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class ShipmentDTO
    {
       
        public Guid OrderId { get; set; }

        [StringLength(100)]
        [Required(ErrorMessage ="Shippername is required")]
        public string ShipperName { get; set; }

        [StringLength(100)]
        [Required(ErrorMessage = "Shippername is required")]
        public string TrackingNumber { get; set; }
         
    }
}
