
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Ecommerce3BRO.Model;

[Table("OrderDetail")]
public partial class OrderDetail
{
    [Key]
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    public Guid ProductId { get; set; }

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal UnitPrice { get; set; }

    public DateTime? CreatedDate { get; set; }

    [ForeignKey("OrderId")]
   
    public  Order? Order { get; set; }

    [ForeignKey("ProductId")]
    
    public Product? Product { get; set; }
}
