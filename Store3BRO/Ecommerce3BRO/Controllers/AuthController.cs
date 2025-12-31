using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IUserRepository _userService;
        private readonly Ecommerce3BROContext _context;
        public AuthController(IAuthService authService, IUserRepository userService, Ecommerce3BROContext context)
        {
            _authService = authService;
            _userService = userService;
            _context = context;
        }
        [HttpPost("login")]
        public async Task<ApiResponse<UserDTO?>> Login([FromBody] LoginModel login)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<UserDTO?>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var findUser = await _context.User.FirstOrDefaultAsync(fu => fu.Email == login.Email);
            if (findUser != null && !findUser.IsActive)
            {
                return new ApiResponse<UserDTO?>(null, null, "400", "Please active account before login", false, 0, 0, 0, 0, null, null, null);
            }
            var result = await _userService.LoginAsync(login);
            if (result == null)
            {
                return new ApiResponse<UserDTO?>(null, null, "404", "Email or Password is wrong", false, 0, 0, 0, 0, null, null, null);
            }
            var roleList = await _authService.GetRolesByUser(result.Email);
            var token = _authService.GenerateAccessToken(result.Email, findUser.Id, roleList);
            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,           // HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });
            return new ApiResponse<UserDTO?>(null, null, "200", "Login successfully", true, 0, 0, 0, 0, token, null, null);
        }
    }
}

