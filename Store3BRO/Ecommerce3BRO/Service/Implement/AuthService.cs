
using Azure;
using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Ecommerce3BRO.Service.Implement
{
    public class AuthService : IAuthService
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AuthService(Ecommerce3BROContext context, IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _config = config;
            _httpContextAccessor = httpContextAccessor;

        }
        public string? GenerateAccessToken(string email, Guid id, List<string> roles)
        {
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, id.ToString()),
        new Claim(ClaimTypes.Email, email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(JwtRegisteredClaimNames.Iat,
            DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
            ClaimValueTypes.Integer64)
    };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



        public async Task<List<string>?> GetRolesByUser(string email)
        {
            var find = await _context.User.FirstOrDefaultAsync(fu => fu.Email == email);
            if (find == null)
            {
                return null;
            }
            var roles = await _context.UserRole
       .Where(ur => ur.UserId == find.Id)
       .Select(ur => ur.Role.RoleName)
       .ToListAsync();

            return roles;
        }

        public string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);

            return Convert.ToBase64String(randomBytes);
        }

        public async Task<ApiResponse<string>> RefreshAccessToken(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
                return new ApiResponse<string>(null, null, "401", "Invalid refresh token", false, 0, 0, 0, 0, null, null, null);
            var storedToken = await _context.RefreshToken
                .FirstOrDefaultAsync(x => x.Token == refreshToken);

            if (storedToken == null || storedToken.IsRevoked)
            {
                return new ApiResponse<string>(null, null, "401", "Refresh token not found", false, 0, 0, 0, 0, null, null, null);
            }
            if (storedToken.ExpiredAt < DateTime.UtcNow)
            {
                storedToken.IsRevoked = true;
                storedToken.RevokedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return new ApiResponse<string>(null, null, "400", "Refresh token has expired", false, 0, 0, 0, 0, null, null, null);
            }
            var user = await _context.User.FindAsync(storedToken.UserId);
            if (user == null)
            {
                return new ApiResponse<string>(null, null, "404", "User not found", false, 0, 0, 0, 0, null, null, null);
            }
            var roles = await GetRolesByUser(user.Email);
            var newAccessToken = GenerateAccessToken(user.Email, user.Id, roles);
            _httpContextAccessor.HttpContext?
               .Response.Cookies.Append("access_token", newAccessToken, new CookieOptions
               {
                   HttpOnly = true,
                   Secure = true,
                   SameSite = SameSiteMode.None,
                   Expires = DateTime.UtcNow.AddMinutes(15)
               });
            var roleString = string.Join(",", roles);
            _httpContextAccessor.HttpContext?
                .Response.Cookies.Append("role", roleString, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(15)
                });
            return new ApiResponse<string>(null, newAccessToken, "200", "Access token refreshed successfully", true, 0, 0, 0, 0, null, null, null);
        }
    }
}
