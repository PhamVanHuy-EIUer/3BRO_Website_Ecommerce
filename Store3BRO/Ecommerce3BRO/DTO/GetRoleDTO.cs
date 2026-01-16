using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class GetRoleDTO
    {
        [Key]
        public Guid Id { get; set; }

        [StringLength(50)]
        public string RoleName { get; set; }

        public string? Description { get; set; }

        public DateTime? CreatedDate { get; set; }
    }
}
