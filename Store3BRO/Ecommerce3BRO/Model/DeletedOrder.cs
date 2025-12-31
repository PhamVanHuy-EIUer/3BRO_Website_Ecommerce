
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Model;


[Table("Deleted_Order")]
public partial class DeletedOrder
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public DateTime? OrderDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? TotalAmount { get; set; }

    [StringLength(50)]
    public string? PaymentMethod { get; set; }

    public int? Status { get; set; }

    public string? ShippingAddress { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? ShippingFee { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? DeletedDate { get; set; }
}
