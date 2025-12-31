
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Ecommerce3BRO.Model;

[Table("Order")]
public partial class Order
{
    [Key]
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public DateTime OrderDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal TotalAmount { get; set; }

    [StringLength(50)]
    public string PaymentMethod { get; set; }

    public int? Status { get; set; }

    public string ShippingAddress { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal ShippingFee { get; set; }

    public DateTime? CreatedDate { get; set; }

    
    public  ICollection<OrderDetail> OrderDetails { get; set; } 

    
    public  ICollection<OrderDiscount> OrderDiscounts { get; set; }

    
    public ICollection<Payment> Payments { get; set; } 

    public virtual ICollection<Shipment> Shipments { get; set; } 

    [ForeignKey("UserId")]
   
    public  User? User { get; set; }
}
