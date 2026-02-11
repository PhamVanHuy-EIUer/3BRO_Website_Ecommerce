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
        var requestBody = new
        {
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
