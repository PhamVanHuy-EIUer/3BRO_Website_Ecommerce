
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Model;


[Table("Deleted_OrderItem")]
public partial class DeletedOrderItem
{
    public Guid Id { get; set; }

    public Guid? OrderId { get; set; }

    public Guid? ProductId { get; set; }

    public int? Quantity { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? UnitPrice { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? DeletedDate { get; set; }
}
