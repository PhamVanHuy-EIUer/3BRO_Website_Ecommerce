using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Service
{
    public class GoogleAuthService
    {
        private readonly IConfiguration _config;
        private readonly Ecommerce3BROContext _context;

        public GoogleAuthService(IConfiguration config,Ecommerce3BROContext context)
        {
            _config = config;
            _context = context;
        }

        public async Task<GoogleJsonWebSignature.Payload> VerifyTokenAsync(string idToken)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["GoogleAuth:ClientId"] }
            };

            return await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
        }
        public async Task<ApiResponse<string>> AddNewPasswordAsync(string email,AddNewPasswordForGG newpassword)
        {
            if (newpassword.NewPassword != newpassword.ConfirmNewPassword)
            {
                return new ApiResponse<string>(null, null, "400", "Cofirm password is incorrect", false, 0, 0, 0, 0, null, null, null);
            }
           var findEmail = await _context.User.FirstOrDefaultAsync(p=>p.Email==email);
            if (findEmail == null)
            {
                return new ApiResponse<string>(null, null, "404", "Email not found", false, 0, 0, 0, 0, null, null, null);
            }
            findEmail.Password = newpassword.NewPassword;
            await _context.SaveChangesAsync();
            return new ApiResponse<string>(null, null, "200", "Add new password successfully", true, 0, 0, 0, 0, null, null, null);
        }
    }
}
