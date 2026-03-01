namespace Ecommerce3BRO.DTO
{
    public class UserOrderDTO
    {
        public Guid OrderId { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string Status { get; set; } = null!;

       
        public List<UserOrderItem> Items { get; set; }

    
        public decimal SubTotal { get; set; }

       
        public decimal? DiscountAmount { get; set; }

   
        public decimal ShippingFee { get; set; }

    
        public decimal TotalAmount { get; set; }

        public int? PaymentStatus { get; set; }

        public string? PaymentMethod { get; set; }
    }

}
