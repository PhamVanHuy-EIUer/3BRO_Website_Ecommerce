namespace Ecommerce3BRO.DTO
{
    public class GetOrderByAdminDTO
    {
        public Guid OrderId { get; set; }
        public string CustomerName { get; set; }
        public string ProductNames { get; set; } 
        public int Amount { get; set; }        
        public decimal TotalPrice { get; set; }
        public decimal RefundPrice { get; set; }
        public decimal NetRevenue { get; set; }
        public string Status { get; set; }
    }
}
