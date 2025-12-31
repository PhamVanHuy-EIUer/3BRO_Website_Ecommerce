
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce3BRO.Model;

[Table("Category")]
public partial class Category
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(100)]
    [Required(ErrorMessage = "Please enter category name")]
    public string CategoryName { get; set; }

    public string? Description { get; set; }

    public bool IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

  
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
