namespace Ecommerce3BRO.DTO
{
    public class CartProductDTO
    {
        public Guid ProductId { get; set; }
        public Guid CartItemID { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string CategoryName { get; set; }
        public string ImageUrl { get; set; }
        public decimal TotalPrice => Price * Quantity;
    }

}
