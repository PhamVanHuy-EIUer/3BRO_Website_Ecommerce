
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Ecommerce3BRO.Model;

[Table("Product")]
public partial class Product
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(100)]
    public string ProductName { get; set; }

    public string? Description { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Price { get; set; }

    public int Stock { get; set; }

    public Guid CategoryId { get; set; }

    [StringLength(255)]
    public string? ImageUrl { get; set; }

    public int? Status { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

   
    public  ICollection<CartItem> CartItems { get; set; } 
    [ForeignKey("CategoryId")]
  
    public  Category? Category { get; set; }

 
    public  ICollection<OrderDetail> OrderDetails { get; set; } 

    public ICollection<Review> Reviews { get; set; } 
}
