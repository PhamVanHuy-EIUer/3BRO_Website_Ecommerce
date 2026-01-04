using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce3BRO.Model
{
    public class Refund
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid OrderDetailId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal RefundAmount { get; set; }

        [StringLength(255)]
        public string? Reason { get; set; }

        public DateTime CreatedDate { get; set; }

 
        [ForeignKey(nameof(OrderDetailId))]
        public OrderDetail OrderDetail { get; set; }
    }
}
