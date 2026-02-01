using Ecommerce3BRO.Model;

namespace Ecommerce3BRO.Service
{
    public interface IMomoService
    {
        Task<MomoCreatePaymentResponse> CreatePaymentAsync(
            Guid orderId,
            decimal amount,
            string orderInfo
        );

        bool VerifyIpnSignature(MomoIpnRequest ipn);
    }

}
