
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Model;


[Table("Deleted_User")]
public partial class DeletedUser
{
    public Guid  Id { get; set; }

    [StringLength(100)]
    public string? FullName { get; set; }

    [StringLength(100)]
    public string? Email { get; set; }

    [StringLength(255)]
    public string? Password { get; set; }

    [StringLength(20)]
    public string? Phone { get; set; }

    [StringLength(255)]
    public string? Address { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? DeletedDate { get; set; }
}
