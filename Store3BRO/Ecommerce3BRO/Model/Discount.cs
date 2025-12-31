
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Ecommerce3BRO.Model;

[Table("Discount")]
public partial class Discount
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(50)]
    public string Code { get; set; } = null!;

    [StringLength(255)]
    public string? Description { get; set; }

    public int? DiscountPercent { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? DiscountAmount { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? MinOrderAmount { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int Quantity { get; set; }

    public bool IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    
    public  ICollection<OrderDiscount> OrderDiscounts { get; set; } 
}
