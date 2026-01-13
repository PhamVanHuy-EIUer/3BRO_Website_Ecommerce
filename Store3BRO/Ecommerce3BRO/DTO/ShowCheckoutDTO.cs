namespace Ecommerce3BRO.DTO
{
    public class ShowCheckoutDTO
    {
        public List<DiscountProductDTO> productList { get; set; } = new();
        public  List<GetDiscountDTO>? Vouchers { get; set; }
        public decimal CurrentTotalPrice { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal DiscountPrice { get; set; }
        public string DiscountCode { get; set; }
        public decimal FinalTotalPrice { get; set; }
        public string UserFullName { get; set; }
        public string UserPhoneNumber { get; set; }
        public string UserAddress { get; set; }
    }
}
