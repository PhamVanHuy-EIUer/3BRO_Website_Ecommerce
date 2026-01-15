using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
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
        private readonly GoogleAuthService _googleAuthService;
        private readonly IAuthService _authService;
        private readonly IUserRepository _userService;
        private readonly Ecommerce3BROContext _context;
        public AuthController(IAuthService authService, IUserRepository userService, Ecommerce3BROContext context, GoogleAuthService googleAuthService)
        {
            _authService = authService;
            _userService = userService;
            _context = context;
            _googleAuthService = googleAuthService;
        }

        //api use for login
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
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });
            return new ApiResponse<UserDTO?>(null, null, "200", "Login successfully", true, 0, 0, 0, 0, token, null, null);
        }

        // api user for logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("access_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });
            return Ok(new ApiResponse<string?>(null, null, "200", "Logout successfully", true, 0, 0, 0, 0, null, null, null));
        }
        // api use for login with google
        [HttpPost("login-google")]
        public async Task<ApiResponse<UserDTO?>> LoginWithGoogle(GoogleLoginRequest request)
        {
            var payload = await _googleAuthService.VerifyTokenAsync(request.IdToken);

            if (!payload.EmailVerified)
                return new ApiResponse<UserDTO?>(null, null, "400", "Email not verified", false, 0, 0, 0, 0, null, null, null);

            var email = payload.Email;
            var googleId = payload.Subject;

            var user = await _context.User
                .FirstOrDefaultAsync(u => u.GoogleId == googleId);

            if (user == null)
            {
                // check email tồn tại chưa
                user = await _context.User.FirstOrDefaultAsync(u => u.Email == email);

                if (user == null)
                {
                    user = new User
                    {
                        Email = email,
                        GoogleId = googleId,
                        Provider = "Google",
                        CreatedDate = DateTime.UtcNow,
                        IsActive = true,
                        Password = BCrypt.Net.BCrypt.HashPassword(request.Password)  
                    };

                    await _context.User.AddAsync(user);
                    await _context.SaveChangesAsync();

                    var role = await _context.Role.FirstAsync(r => r.RoleName == "User");

                    await _context.UserRole.AddAsync(new UserRole
                    {
                        UserId = user.Id,
                        RoleId = role.Id,
                        CreatedDate = DateTime.UtcNow
                    });

                    await _context.SaveChangesAsync();
                }
                else
                {
                    // link account
                    user.GoogleId = googleId;
                    user.Provider = "Google";
                    await _context.SaveChangesAsync();
                }
            }

            var roleList = await _authService.GetRolesByUser(user.Email);
            var token = _authService.GenerateAccessToken(user.Email, user.Id, roleList);

            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });

            return new ApiResponse<UserDTO?>(null, null, "200", "Login with Google successfully", true, 0, 0, 0, 0, token, null, null);
        }

    }
}

