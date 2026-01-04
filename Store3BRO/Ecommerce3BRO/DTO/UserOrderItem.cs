namespace Ecommerce3BRO.DTO
{
    public class UserOrderItem
    {
        public Guid OrderItem { get; set; }
        public string ProductName { get; set; }

        public string? ImageUrl { get; set; }

        public decimal Price { get; set; }   

        public int Quantity { get; set; }

        public decimal TotalPrice { get; set; }
    }
}
