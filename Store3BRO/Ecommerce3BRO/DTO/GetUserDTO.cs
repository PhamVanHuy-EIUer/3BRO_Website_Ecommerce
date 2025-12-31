using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class GetUserDTO
    {

        [Key]
        public Guid Id { get; set; }

        [StringLength(100)]
        public string? FullName { get; set; }

        [StringLength(100)]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Email is invalid")]
        public string Email { get; set; }

        [StringLength(20)]
        [RegularExpression(@"^(0[3|5|7|8|9])[0-9]{8}$",
            ErrorMessage = "Phone number is invalid")]
        public string? Phone { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

        public bool IsActive { get; set; }

        public DateTime? CreatedDate { get; set; }
    }
}
