using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class GetSupportDTO
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Customer name is required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Email is invalid")]
        public string Email { get; set; }
        public string? Subject { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
