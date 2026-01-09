using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class ProductImageDTO
    {
        [Required]
        public Guid ProductId { get; set; }
        [Required(ErrorMessage = "Please upload images")]
        public string ImageUrl { get; set; }
    }
}
