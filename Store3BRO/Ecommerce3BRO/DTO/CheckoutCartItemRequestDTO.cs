namespace Ecommerce3BRO.DTO
{
    public class CheckoutCartItemRequestDTO
    {
        public string? DiscountCode { get; set; } 
        public List<Guid> CartItemIds { get; set; }
        
    }
}
