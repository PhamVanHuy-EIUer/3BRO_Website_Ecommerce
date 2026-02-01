namespace Ecommerce3BRO.Model
{
    public class MomoIpnRequest
    {
        public string PartnerCode { get; set; }
        public Guid OrderId { get; set; }
        public string RequestId { get; set; }
        public long Amount { get; set; }
        public string OrderInfo { get; set; }
        public int ResultCode { get; set; }
        public string Signature { get; set; }
    }
}
