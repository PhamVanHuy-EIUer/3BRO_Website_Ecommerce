using System.ComponentModel.DataAnnotations;

namespace Ecommerce3BRO.DTO
{
    public class GetOrderDTO
    {
        public Guid Id { get; set; }
        public string PaymentMethod { get; set; }
        public string ShippingAddress { get; set; }
    }
}
