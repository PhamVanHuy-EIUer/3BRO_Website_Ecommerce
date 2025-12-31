
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce3BRO.Model;

[Table("ActivationCode")]
public partial class ActivationCode
{
    [Key]
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    [StringLength(10)]
    public string Code { get; set; }

    public DateTime ExpireDate { get; set; }

    public bool IsUsed { get; set; }

    public DateTime? CreatedDate { get; set; }

    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}
