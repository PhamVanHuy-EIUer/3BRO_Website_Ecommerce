namespace Ecommerce3BRO.DTO
{
    public class OrderDTO
    {
        public string ShippingAddress { get; set; }
        public string PaymentMethod { get; set; }
        public Guid? DiscountId { get; set; }

        public List<OrderItemDTO> Items { get; set; }
    }
}
