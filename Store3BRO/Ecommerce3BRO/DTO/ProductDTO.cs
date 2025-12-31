using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce3BRO.DTO
{
    public class ProductDTO
    {
        [StringLength(100)]
        [Required(ErrorMessage ="Please enter the name of product")]
        public string ProductName { get; set; }

        public string? Description { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        [Required(ErrorMessage ="Please enter the price of product")]
        public decimal Price { get; set; }
        [Required(ErrorMessage ="Please enter the stock of product")]
        public int Stock { get; set; }
        [Required(ErrorMessage ="Please enter the categoty of product")]
        public Guid CategoryId { get; set; }
    }
}
