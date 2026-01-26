using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.Model
{
    public class Support
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage ="Customer name is required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Email is invalid")]
        public string Email { get; set; }
        public string? Subject { get; set; }
        [Required(ErrorMessage ="Message is required")]
        public string Message { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
