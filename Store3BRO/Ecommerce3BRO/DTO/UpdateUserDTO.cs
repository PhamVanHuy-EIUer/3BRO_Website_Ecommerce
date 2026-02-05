using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class UpdateUserDTO
    {
        [StringLength(100)]
        public string? FullName { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }
        [Required(ErrorMessage = "Latitude is required")]

        public Decimal Latitude { get; set; }
        [Required(ErrorMessage = "Longtitude is required")]
        public Decimal Longtitude { get; set; }
    }
}
