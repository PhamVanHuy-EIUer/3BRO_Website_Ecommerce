
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce3BRO.Model;

[Table("UserRole")]
public partial class UserRole
{
    [Key]
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid RoleId { get; set; }

    public DateTime? CreatedDate { get; set; }

    [ForeignKey("RoleId")]
   
    public  Role? Role { get; set; } 

    [ForeignKey("UserId")]
    public User? User { get; set; } 
}
