using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class CategoryDTO
    {
        [StringLength(100)]
        [Required(ErrorMessage ="Please enter category name")]
        public string CategoryName { get; set; }

        public string? Description { get; set; }

    }
}
