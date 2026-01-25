namespace Ecommerce3BRO.DTO
{
    public class ViewOrderDetailDTO
    {
        public Guid OrderItemId { get; set; }
        public string ProductName { get; set; }

        public string? ImageUrl { get; set; }

        public decimal Price { get; set; }

        public int Quantity { get; set; }
        public bool IsReturn { get; set; }

        public decimal ShippingFee { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
