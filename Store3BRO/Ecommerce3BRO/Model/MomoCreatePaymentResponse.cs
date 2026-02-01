namespace Ecommerce3BRO.Model
{
    public class MomoCreatePaymentResponse
    {
        public int ResultCode { get; set; }
        public string Message { get; set; }
        public string PayUrl { get; set; }
        public string Deeplink { get; set; }
        public string QrCodeUrl { get; set; }
    }
}
