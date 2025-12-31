
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Ecommerce3BRO.Model;

[Table("Cart")]
public partial class Cart
{
    [Key]
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public bool IsDeleted { get; set; }

    public DateTime? CreatedDate { get; set; }


    
    public  ICollection<CartItem>? CartItems { get; set; }

    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}
