using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class SupportDTO
    {
        public string Name { get; set; }
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Email is invalid")]
        public string Email { get; set; }
        public string? Subject { get; set; }
        [Required(ErrorMessage = "Message is required")]
        public string Message { get; set; }
    }
}
