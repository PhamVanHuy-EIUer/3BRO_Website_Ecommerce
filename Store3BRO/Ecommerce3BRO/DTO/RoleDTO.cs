using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class RoleDTO
    {
        [Required(ErrorMessage ="Please enter the role")]
        public string RoleName { get; set; }

        public string? Description { get; set; }

    }
}
