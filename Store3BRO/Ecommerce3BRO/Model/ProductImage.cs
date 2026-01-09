using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.Model
{
    public class ProductImage
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid ProductId { get; set; }
        [Required(ErrorMessage ="Please upload images")]
        public string ImageUrl { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
