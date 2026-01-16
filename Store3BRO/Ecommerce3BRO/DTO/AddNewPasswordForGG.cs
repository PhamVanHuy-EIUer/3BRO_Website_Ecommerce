using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class AddNewPasswordForGG
    {
        [Required(ErrorMessage = "Please enter the password")]
        public string NewPassword { get; set; }
        [Required(ErrorMessage = "Please confirmed the password")]
        public string ConfirmNewPassword { get; set; }
    }
}
