
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Model;


[Table("Deleted_Product")]
public partial class DeletedProduct
{
    public Guid Id { get; set; }

    [StringLength(100)]
    public string? ProductName { get; set; }

    public string? Description { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? Price { get; set; }

    public int? Stock { get; set; }

    public Guid? CategoryId { get; set; }

    [StringLength(255)]
    public string? ImageUrl { get; set; }

    public int? Status { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? DeletedDate { get; set; }
}
