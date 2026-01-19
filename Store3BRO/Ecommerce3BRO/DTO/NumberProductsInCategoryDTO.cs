using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class NumberProductsInCategoryDTO
    {
        public Guid CategoryId { get; set; }

        [StringLength(100)]
        public string CategoryName { get; set; }

        public int TotalProducts { get; set; }
    }
}
