using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class ResponseDTO
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Email is invalid")]
        public string Email { get; set; }
        [Required(ErrorMessage ="Response is required")]
        public string Response { get; set; }
    }
}
