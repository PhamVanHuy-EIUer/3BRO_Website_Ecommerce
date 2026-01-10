using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class GetCategoryDTO
    {
        [Key]
        public Guid Id { get; set; }

        [StringLength(100)]
        [Required(ErrorMessage = "Please enter category name")]
        public string CategoryName { get; set; }

        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
    }
}
