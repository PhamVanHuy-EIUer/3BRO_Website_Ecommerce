using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class ForgetPasswordDTO
    {
        [StringLength(100)]
        [Required(ErrorMessage = "Email is empty")]
        [EmailAddress(ErrorMessage = "Email is invalid")]
        public string Email { get; set; }
        public string Code { get; set; }    
    }
}
