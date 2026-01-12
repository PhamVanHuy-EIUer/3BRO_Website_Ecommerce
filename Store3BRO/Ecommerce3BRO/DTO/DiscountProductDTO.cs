namespace Ecommerce3BRO.DTO
{
    public class DiscountProductDTO
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string CategoryName { get; set; }
        public string ImageUrl { get; set; }
        public decimal SubTotalPrice => Price * Quantity;
       

    }
}
