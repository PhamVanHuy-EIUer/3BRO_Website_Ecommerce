using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce3BRO.Model
{
    public class UserLocation
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
<<<<<<< HEAD

        [Column(TypeName = "decimal(9,6)")]
        public decimal Latitude { get; set; }
        [Column(TypeName = "decimal(10,6)")]
=======
        [Column(TypeName = "decimal(9,6)")]
        public decimal Latitude { get; set; }
        [Column(TypeName = "decimal(9,6)")]
>>>>>>> origin/main
        public decimal Longitude { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
