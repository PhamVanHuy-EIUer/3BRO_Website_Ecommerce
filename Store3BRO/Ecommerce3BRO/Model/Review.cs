
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Ecommerce3BRO.Model;

[Table("Review")]
public partial class Review
{
    [Key]
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid ProductId { get; set; }

    public int Rating { get; set; }

    public string Comment { get; set; }

    public DateTime? CreatedDate { get; set; }

    [ForeignKey("ProductId")]
   
    public  Product? Product { get; set; }

    [ForeignKey("UserId")]

    public  User? User { get; set; }
}
