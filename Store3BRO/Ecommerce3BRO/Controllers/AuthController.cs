using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

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
            var roles = string.Join(",", roleList);
            var token = _authService.GenerateAccessToken(result.Email, findUser.Id, roleList);
            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });
            Response.Cookies.Append("role", roles, new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddMinutes(15)
            });
            var oldTokens = await _context.RefreshToken
    .Where(x => x.UserId == findUser.Id && !x.IsRevoked)
    .ToListAsync();

            foreach (var t in oldTokens)
            {
                t.IsRevoked = true;
                t.RevokedAt = DateTime.UtcNow;
            }
            var refreshToken = _authService.GenerateRefreshToken();
            var options = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refresh_token", refreshToken, options);
            await _context.RefreshToken.AddAsync(new RefreshToken
            {
                UserId = findUser.Id,
                Token = refreshToken,
                ExpiredAt = DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
            return new ApiResponse<UserDTO?>(null, null, "200", "Login successfully", true, 0, 0, 0, 0, token, null, null);
        }

        // api user for logout
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refresh_token"];

            if (!string.IsNullOrEmpty(refreshToken))
            {
                var token = await _context.RefreshToken
                    .FirstOrDefaultAsync(r => r.Token == refreshToken);

                if (token != null && !token.IsRevoked)
                {
                    token.IsRevoked = true;
                    token.RevokedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
            }

            Response.Cookies.Delete("access_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
            });
            Response.Cookies.Delete("refresh_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
            });

            return Ok(new ApiResponse<string?>(
                null, null, "200", "Logout successfully",
                true, 0, 0, 0, 0, null, null, null));
        }

        // api use for login with google
        [HttpPost("login-google")]
        public async Task<IActionResult> LoginWithGoogle(GoogleLoginRequest request)
        {
            var payload = await _googleAuthService.VerifyTokenAsync(request.IdToken);

            if (!payload.EmailVerified)
                return Unauthorized(new ApiResponse<UserDTO?>(
                    null, null, "401", "Email not verified",
                    false, 0, 0, 0, 0, null, null, null));

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
                        IsActive = true
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

                    var newRoleList = await _authService.GetRolesByUser(user.Email);
                    var newToken = _authService.GenerateAccessToken(user.Email, user.Id, newRoleList);

                    Response.Cookies.Append("access_token", newToken, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = DateTime.UtcNow.AddMinutes(15)
                    });

                    var oldToken = await _context.RefreshToken
                        .Where(x => x.UserId == user.Id && !x.IsRevoked)
                        .ToListAsync();

                    foreach (var t in oldToken)
                    {
                        t.IsRevoked = true;
                        t.RevokedAt = DateTime.UtcNow;
                    }

                    var newRefreshToken = _authService.GenerateRefreshToken();
                    var option = new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = DateTime.UtcNow.AddDays(7)
                    };

                    Response.Cookies.Append("refresh_token", newRefreshToken, option);

                    await _context.RefreshToken.AddAsync(new RefreshToken
                    {
                        UserId = user.Id,
                        Token = newRefreshToken,
                        ExpiredAt = DateTime.UtcNow.AddDays(7),
                        IsRevoked = false,
                        CreatedAt = DateTime.UtcNow
                    });

                    await _context.SaveChangesAsync();

                    return BadRequest(new ApiResponse<UserDTO?>(
                        null, null, "201", "Login with Google successfully without password",
                        true, 0, 0, 0, 0, newToken, null, null));
                }
            }
            user.GoogleId ??= googleId;
            user.Provider = "Google";
            await _context.SaveChangesAsync();

            var roleList = await _authService.GetRolesByUser(user.Email);
            var token = _authService.GenerateAccessToken(user.Email, user.Id, roleList);

            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });

            var oldTokens = await _context.RefreshToken
                .Where(x => x.UserId == user.Id && !x.IsRevoked)
                .ToListAsync();

            foreach (var t in oldTokens)
            {
                t.IsRevoked = true;
                t.RevokedAt = DateTime.UtcNow;
            }

            var refreshToken = _authService.GenerateRefreshToken();
            var options = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken, options);

            await _context.RefreshToken.AddAsync(new RefreshToken
            {
                UserId = user.Id,
                Token = refreshToken,
                ExpiredAt = DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<UserDTO?>(
                null, null, "200", "Login with Google successfully",
                true, 0, 0, 0, 0, token, null, null));
        }
        //public async Task<ApiResponse<UserDTO?>> LoginWithGoogle(GoogleLoginRequest request)
        //{
        //    var payload = await _googleAuthService.VerifyTokenAsync(request.IdToken);

        //    if (!payload.EmailVerified)
        //        return new ApiResponse<UserDTO?>(null, null, "400", "Email not verified", false, 0, 0, 0, 0, null, null, null);

        //    var email = payload.Email;
        //    var googleId = payload.Subject;

        //    var user = await _context.User
        //        .FirstOrDefaultAsync(u => u.GoogleId == googleId);

        //    if (user == null)
        //    {
        //        // check email tồn tại chưa
        //        user = await _context.User.FirstOrDefaultAsync(u => u.Email == email);

        //        if (user == null)
        //        {
        //            user = new User
        //            {
        //                Email = email,
        //                GoogleId = googleId,
        //                Provider = "Google",
        //                CreatedDate = DateTime.UtcNow,
        //                IsActive = true
        //            };

        //            await _context.User.AddAsync(user);
        //            await _context.SaveChangesAsync();

        //            var role = await _context.Role.FirstAsync(r => r.RoleName == "User");

        //            await _context.UserRole.AddAsync(new UserRole
        //            {
        //                UserId = user.Id,
        //                RoleId = role.Id,
        //                CreatedDate = DateTime.UtcNow
        //            });
        //            await _context.SaveChangesAsync();
        //            var newRoleList = await _authService.GetRolesByUser(user.Email);
        //            var newToken = _authService.GenerateAccessToken(user.Email, user.Id, newRoleList);

        //            Response.Cookies.Append("access_token", newToken, new CookieOptions
        //            {
        //                HttpOnly = true,
        //                Secure = true,
        //                SameSite = SameSiteMode.None,
        //                Expires = DateTime.UtcNow.AddMinutes(15)
        //            });
        //            var oldToken = await _context.RefreshToken.Where(x => x.UserId == user.Id && !x.IsRevoked).ToListAsync();

        //            foreach (var t in oldToken)
        //            {
        //                t.IsRevoked = true;
        //                t.RevokedAt = DateTime.UtcNow;
        //            }
        //            var newRefreshToken = _authService.GenerateRefreshToken();
        //            var option = new CookieOptions
        //            {
        //                HttpOnly = true,
        //                Secure = true,
        //                SameSite = SameSiteMode.None,
        //                Expires = DateTime.UtcNow.AddDays(7)
        //            };
        //            Response.Cookies.Append("refreshToken", newRefreshToken, option);
        //            await _context.RefreshToken.AddAsync(new RefreshToken
        //            {
        //                UserId = user.Id,
        //                Token = newRefreshToken,
        //                ExpiredAt = DateTime.UtcNow.AddDays(7),
        //                IsRevoked = false,
        //                CreatedAt = DateTime.UtcNow
        //            });
        //            await _context.SaveChangesAsync();

        //            return new ApiResponse<UserDTO?>(null, null, "200", "Login with Google successfully", false, 0, 0, 0, 0, newToken, null, null);
        //        }
        //    }
        //    // link account
        //    user.GoogleId = googleId;
        //    user.Provider = "Google";
        //    await _context.SaveChangesAsync();
        //    var roleList = await _authService.GetRolesByUser(user.Email);
        //    var token = _authService.GenerateAccessToken(user.Email, user.Id, roleList);

        //    Response.Cookies.Append("access_token", token, new CookieOptions
        //    {
        //        HttpOnly = true,
        //        Secure = true,
        //        SameSite = SameSiteMode.None,
        //        Expires = DateTime.UtcNow.AddMinutes(15)
        //    });
        //    var oldTokens = await _context.RefreshToken.Where(x => x.UserId == user.Id && !x.IsRevoked).ToListAsync();

        //    foreach (var t in oldTokens)
        //    {
        //        t.IsRevoked = true;
        //        t.RevokedAt = DateTime.UtcNow;
        //    }
        //    var refreshToken = _authService.GenerateRefreshToken();
        //    var options = new CookieOptions
        //    {
        //        HttpOnly = true,
        //        Secure = true,
        //        SameSite = SameSiteMode.None,
        //        Expires = DateTime.UtcNow.AddDays(7)
        //    };
        //    Response.Cookies.Append("refreshToken", refreshToken, options);
        //    await _context.RefreshToken.AddAsync(new RefreshToken
        //    {
        //        UserId = user.Id,
        //        Token = refreshToken,
        //        ExpiredAt = DateTime.UtcNow.AddDays(7),
        //        IsRevoked = false,
        //        CreatedAt = DateTime.UtcNow
        //    });
        //    await _context.SaveChangesAsync();
        //    return new ApiResponse<UserDTO?>(null, null, "200", "Login with Google successfully", true, 0, 0, 0, 0, token, null, null);
        //}


        [HttpPost("addnewpass-gg")]
        public async Task<ApiResponse<string>> AddNewPasswordForGoogleUser([FromBody] AddNewPasswordForGG newpassword)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<string>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var userClaim = User.FindFirst(ClaimTypes.Email);
            if (userClaim == null)
            {
                return new ApiResponse<string>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == userClaim.Value);
            if (user == null)
            {
                return new ApiResponse<string>(null, null, "404", "User not found", false, 0, 0, 0, 0, null, null, null);
            }
            var result = await _googleAuthService.AddNewPasswordAsync(user.Email, newpassword);
            return result;
        }

        [HttpPost("refresh")]

        public async Task<IActionResult> RefreshAccessToken()
        {
            var refreshToken = Request.Cookies["refresh_token"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized(new ApiResponse<string>(
                    null, null, "401", "Refresh token not found", false,
                    0, 0, 0, 0, null, null, null
                ));
            }
            var result = await _authService.RefreshAccessToken(refreshToken);
            return StatusCode(int.Parse(result.Code), result);
        }
    }
}
