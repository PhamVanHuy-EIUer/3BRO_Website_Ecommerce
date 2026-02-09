using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace Ecommerce3BRO.DTO
{
    public class OrderDTO
    {
        [Required(ErrorMessage = "Address is required")]

        public string ShippingAddress { get; set; }
        [StringLength(50)]
        [RegularExpression("^(Transfer|Cash)$",
         ErrorMessage = "Payment methods accepted are bank transfer or cash.")]
        public string PaymentMethod { get; set; }
        public Guid? DiscountId { get; set; }
        public List<OrderItemDTO> Items { get; set; }
    }
}
