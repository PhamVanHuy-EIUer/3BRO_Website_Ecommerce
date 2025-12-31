using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class UpdatePasswordDTO
    {
        [StringLength(100)]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Email is invalid")]
        public string Email { get; set; }
        [StringLength(255)]
        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must have more  8 characters")]
        public string Password { get; set; }

    }
}
