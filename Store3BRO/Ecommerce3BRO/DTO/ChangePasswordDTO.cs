using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class ChangePasswordDTO
    {
        [StringLength(255)]
        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must have more  8 characters")]
        public string CurrentPassword { get; set; }
        [StringLength(255)]
        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must have more  8 characters")]
        public string NewPassword { get; set; }
        [StringLength(255)]
        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must have more  8 characters")]
        public string ConfirmNewPassword { get; set; }

    }
}
