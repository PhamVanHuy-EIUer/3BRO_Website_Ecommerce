using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    [Index("Email", Name = "UQ__User__A9D10534E155E666", IsUnique = true)]
    public class UserDTO
    {

        [StringLength(100)]
        public string? FullName { get; set; }

        [StringLength(100)]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Email is invalid")]
        public string Email { get; set; }
        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

    }
}
