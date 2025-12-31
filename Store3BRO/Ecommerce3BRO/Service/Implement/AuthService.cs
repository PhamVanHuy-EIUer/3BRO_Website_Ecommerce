
using Ecommerce3BRO.Data;
using Ecommerce3BRO.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Ecommerce3BRO.Service.Implement
{
    public class AuthService : IAuthService
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IConfiguration _config;
        public AuthService(Ecommerce3BROContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
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
                expires: DateTime.UtcNow.AddMinutes(30),
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
    }
}
