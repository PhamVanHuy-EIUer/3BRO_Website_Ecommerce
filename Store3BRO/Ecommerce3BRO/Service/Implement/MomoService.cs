using Ecommerce3BRO.Model;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;

namespace Ecommerce3BRO.Service.Implement
{
    public class MomoService : IMomoService
    {
        private readonly MomoOptionModel _options;
        private readonly HttpClient _httpClient;

        public MomoService(IOptions<MomoOptionModel> options, HttpClient httpClient)
        {
            _options = options.Value;
            _httpClient = httpClient;
        }

        public async Task<MomoCreatePaymentResponse> CreatePaymentAsync(
            Guid orderId,
            decimal amount,
            string orderInfo)
        {
            var requestId = Guid.NewGuid().ToString("N");
            var rawData =
                $"accessKey={_options.AccessKey}" +
                $"&amount={(long)amount}" +
                $"&extraData=" +
                $"&ipnUrl={_options.IpnUrl}" +
                $"&orderId={orderId}" +
                $"&orderInfo={orderInfo}" +
                $"&partnerCode={_options.PartnerCode}" +
                $"&redirectUrl={_options.RedirectUrl}" +
                $"&requestId={requestId}" +
                $"&requestType={_options.RequestType}";

            var signature = SignSHA256(rawData, _options.SecretKey);

            var payload = new
            {
                partnerCode = _options.PartnerCode,
                accessKey = _options.AccessKey,
                requestId = requestId,
                amount = amount,
                orderId = orderId,
                orderInfo = orderInfo,
                redirectUrl = _options.RedirectUrl,
                ipnUrl = _options.IpnUrl,
                requestType = _options.RequestType,
                extraData = "",
                signature = signature,
                lang = "vi"
            };

            var content = new StringContent(
                JsonConvert.SerializeObject(payload),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(_options.Endpoint, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<MomoCreatePaymentResponse>(responseBody);
        }

        public bool VerifyIpnSignature(MomoIpnRequest ipn)
        {
            var rawData =
                $"amount={ipn.Amount}" +
                $"&orderId={ipn.OrderId}" +
                $"&orderInfo={ipn.OrderInfo}" +
                $"&partnerCode={ipn.PartnerCode}" +
                $"&requestId={ipn.RequestId}" +
                $"&resultCode={ipn.ResultCode}";

            var expectedSignature = SignSHA256(rawData, _options.SecretKey);
            return expectedSignature == ipn.Signature;
        }

        private string SignSHA256(string rawData, string secretKey)
        {
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var messageBytes = Encoding.UTF8.GetBytes(rawData);

            using var hmac = new HMACSHA256(keyBytes);
            var hashBytes = hmac.ComputeHash(messageBytes);

            return BitConverter
                .ToString(hashBytes)
                .Replace("-", "")
                .ToLower();
        }
    }

}
