
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Ecommerce3BRO.Model;

[Table("Shipment")]
public partial class Shipment
{
    [Key]
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    [StringLength(100)]
    public string ShipperName { get; set; }

    [StringLength(100)]
    public string TrackingNumber { get; set; }

    public DateTime ShipDate { get; set; }

    public DateTime DeliveryDate { get; set; }

    public int? Status { get; set; }

    public DateTime? CreatedDate { get; set; }

    [ForeignKey("OrderId")]
    
    public Order? Order { get; set; }
}
