using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce3BRO.DTO
{
    public class GetProductDTO
    {
        [Key]
        public Guid Id { get; set; }

        [StringLength(100)]
        public string ProductName { get; set; }

        public string? Description { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal Price { get; set; }

        public int Stock { get; set; }

        public string CategoryName { get; set; }

        [StringLength(255)]
        public string? ImageUrl { get; set; }
    }
}
