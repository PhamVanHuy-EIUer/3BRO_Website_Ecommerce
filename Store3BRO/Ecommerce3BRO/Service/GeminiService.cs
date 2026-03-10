using Ecommerce3BRO.Service;
using Microsoft.Extensions.Options;
using System.Text.Json;

public class GeminiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GeminiService(
        HttpClient httpClient,
        IOptions<GeminiOptions> options)
    {
        _httpClient = httpClient;
        _apiKey = options.Value.ApiKey;
    }

    public async Task<string> AskGemini(string message)
    {
        string projectContext = @"
        Bạn là trợ lý ảo cho website '3BRO Store'.
        Thông tin dự án:
        - Đây là web bán những thiết bị điện tử .
        - Giờ làm việc: 8h - 17h.
        - Hotline: 0364663858.
        - Chính sách đổi trả: Trong vòng 7 ngày nếu lỗi nhà sản xuất.
        - Sản phẩm nổi bật: Laptop, Điện thoại, Tai nghe.
        - Trong tầm giá 10 triệu, có các sản phẩm như: Điện thoại Samsung Galaxy Z Flip, Tai nghe Gaming Sony.
        - Trong tầm giá 20 triệu, có các sản phẩm như: Iphone 17 Pro,Laptop Acer Aspire Lite16.
        Hãy trả lời ngắn gọn, lịch sự và hỗ trợ khách hàng mua hàng.
    ";
        var requestBody = new
        {
            system_instruction = new
            {
                parts = new[]
            {
                new { text = projectContext }
            }
            },
            contents = new[]
            {
            new
            {
                parts = new[]
                {
                    new { text = message }
                }
            }
        }
        };

        var response = await _httpClient.PostAsJsonAsync(
   $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}",
    requestBody);


        var result = await response.Content.ReadAsStringAsync();

        Console.WriteLine("RAW RESPONSE:");
        Console.WriteLine(result);

        if (!response.IsSuccessStatusCode)
        {
            return "HTTP ERROR: " + result;
        }

        using var doc = JsonDocument.Parse(result);

        // Nếu có candidates
        if (doc.RootElement.TryGetProperty("candidates", out var candidates))
        {
            return candidates[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString() ?? "No response";
        }

        // Nếu có error
        if (doc.RootElement.TryGetProperty("error", out var error))
        {
            return "Gemini Error: " + error.GetProperty("message").GetString();
        }

        return "Unexpected response format";
    }

}
