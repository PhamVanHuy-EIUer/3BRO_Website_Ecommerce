
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Ecommerce3BRO.Model;

[Table("Role")]
public partial class Role
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(50)]
    public string RoleName { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedDate { get; set; }

    
    public ICollection<UserRole> UserRoles { get; set; }
}
