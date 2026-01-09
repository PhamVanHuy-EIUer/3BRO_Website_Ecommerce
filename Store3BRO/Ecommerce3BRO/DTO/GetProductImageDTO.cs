using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class GetProductImageDTO
    {
        [Key]
        public Guid Id { get; set; }
        public string ProductName { get; set; }
        public string ImageUrl { get; set; }
    }
}
