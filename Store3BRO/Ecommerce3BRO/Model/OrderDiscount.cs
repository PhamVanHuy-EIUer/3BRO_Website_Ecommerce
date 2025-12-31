
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce3BRO.Model;

[Table("OrderDiscount")]
public partial class OrderDiscount
{
    [Key]
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    public Guid DiscountId { get; set; }

    public bool IsUsed { get; set; }

    public DateTime AssignedDate { get; set; }

    public DateTime? CreatedDate { get; set; }

    [ForeignKey("DiscountId")]
    
    public  Discount? Discount { get; set; }

    [ForeignKey("OrderId")]
    
    public  Order? Order { get; set; }
}
