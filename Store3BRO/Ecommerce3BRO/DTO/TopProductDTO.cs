using System.Globalization;

namespace Ecommerce3BRO.DTO
{
    public class TopProductDTO
    {
        public Guid productId { get; set; }
        public string productName { get; set; }

        public decimal totalRevenue { get; set; }
    }
}
