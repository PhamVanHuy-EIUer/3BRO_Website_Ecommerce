using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class ReviewDTO
    {
        public Guid ProductId { get; set; }
        [Required(ErrorMessage = "Rating is required")]
        public int Rating { get; set; }
        [Required(ErrorMessage ="Comment is required")]

        public string Comment { get; set; }
    }
}
