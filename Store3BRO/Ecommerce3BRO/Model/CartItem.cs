
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Ecommerce3BRO.Model;

[Table("CartItem")]
public partial class CartItem
{
    [Key]
    public Guid Id { get; set; }

    public Guid CartId { get; set; }

    public Guid ProductId { get; set; }

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Price { get; set; }

    public DateTime? CreatedDate { get; set; }

    [ForeignKey("CartId")]
    
    public  Cart? Cart { get; set; }

    [ForeignKey("ProductId")]
  
    public  Product? Product { get; set; }
}
