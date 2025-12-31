
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Ecommerce3BRO.Model;

[Table("Payment")]
public partial class Payment
{
    [Key]
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    public DateTime PaymentDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Amount { get; set; }

    [StringLength(50)]
    public string PaymentMethod { get; set; }

    [StringLength(100)]
    public string TransactionCode { get; set; }

    public int? Status { get; set; }

    public DateTime? CreatedDate { get; set; }

    [ForeignKey("OrderId")]
    
    public  Order? Order { get; set; }
}
