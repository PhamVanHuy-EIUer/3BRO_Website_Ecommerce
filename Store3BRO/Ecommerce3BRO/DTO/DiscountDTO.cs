using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce3BRO.DTO
{
    public class DiscountDTO
    {
        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(255)]
        public string? Description { get; set; }

        public int? DiscountPercent { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal? DiscountAmount { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal? MinOrderAmount { get; set; }
        // Mức giảm tối đa cho loại giảm theo %
        [Column(TypeName = "decimal(10, 2)")]
        public decimal? MaxDiscountAmount { get; set; }
        public DateTime StartDate { get; set; }

        public DateTime ExpiredDate { get; set; }

        public int Quantity { get; set; }

    }
}
