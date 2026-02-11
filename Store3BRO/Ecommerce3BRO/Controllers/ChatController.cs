using Ecommerce3BRO.DTO;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : Controller
    {
        private readonly GeminiService _geminiService;

        public ChatController(GeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] ChatDTO request)
        {
            var response = await _geminiService.AskGemini(request.Message);
            return Ok(response);
        }
    }
 
}
