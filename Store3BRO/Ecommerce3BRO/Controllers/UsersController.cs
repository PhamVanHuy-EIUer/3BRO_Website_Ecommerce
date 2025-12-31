using Azure.Core;
using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Ecommerce3BRO.Service.Implement;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IUserRepository _userService;
        public UsersController(Ecommerce3BROContext context, IUserRepository userService)
        {
            _context = context;
            _userService = userService;
        }

        //function user use to register
        [HttpPost("register")]
        public async Task<ApiResponse<GetUserDTO>> Register([FromBody] RegisterModel user)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetUserDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var checkDup = await _context.User.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (checkDup != null)
            {
                return new ApiResponse<GetUserDTO>(null, null, "409", "Email is existed", false, 0, 0, 0, 0, null, null, null);
            }
            var result = await _userService.RegisterAsync(user);
            return new ApiResponse<GetUserDTO>(null, result, "200", "Register successfully", true, 0, 0, 0, 0, null, null, null);

        }

        // function to active user after enter activation code successfully
        [HttpGet("active-user")]
        public async Task<ApiResponse<UserDTO?>> ActiveUser([FromQuery] Guid id, [FromQuery] string activeCode)
        {
            var findActiveCode = await _context.ActivationCode.FirstOrDefaultAsync(a => a.Code == activeCode && a.IsUsed == false);
            if (findActiveCode == null)
            {
                return new ApiResponse<UserDTO?>(null, null, "400", "Activation Code is wrong", false, 0, 0, 0, 0, null, null, null);
            }
            if (findActiveCode.UserId != id)
            {
                return new ApiResponse<UserDTO?>(null, null, "400", "Invalid Activation Code", false, 0, 0, 0, 0, null, null, null);
            }
            if (findActiveCode.ExpireDate < DateTime.Now)
            {
                return new ApiResponse<UserDTO?>(null, null, "409", " Activation Code is expired", false, 0, 0, 0, 0, null, null, null);
            }
            var result = await _userService.ActiveUserAsync(id, activeCode);
            return new ApiResponse<UserDTO?>(null, result, "200", "Active user successfully", true, 0, 0, 0, 0, null, null, null);
        }

        // function to send activation code again if activation code is expired
        [HttpPost("send-activecode")]
        public async Task<ApiResponse<string>> SendActiveCode([FromQuery] Guid id)
        {
            await _userService.SendActiveCodeAsync(id);
            return new ApiResponse<string>(null, null, "200", "Send activation code successfully", true, 0, 0, 0, 0, null, null, null);
        }

        //function send code to email when user forget password
        [HttpPost("forget-password")]
        public async Task<ApiResponse<UserDTO?>> ForgetPassWord([FromQuery] string email)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<UserDTO?>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var result = await _userService.ForgetPasswordAsync(email);
            if (result == null)
            {
                return new ApiResponse<UserDTO?>(null, null, "404", "Email is not exist", false, 0, 0, 0, 0, null, null, null);
            }
            return new ApiResponse<UserDTO?>(null, result, "200", "Sent activecode please check the email", true, 0, 0, 0, 0, null, null, null);
        }

        // api use to verify activecode after user forget password
        [HttpPost("verify-code")]
        public async Task<ApiResponse<UserDTO?>> VerifyActivationCode([FromBody] ForgetPasswordDTO user)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<UserDTO?>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var result = await _userService.VerifyActivationCodeAsync(user);
            if (result == null)
            {
                return new ApiResponse<UserDTO?>(null, null, "400", "Activation code is invalid", false, 0, 0, 0, 0, null, null, null);
            }
            return new ApiResponse<UserDTO?>(null, result, "200", "Activation code is correct", true, 0, 0, 0, 0, null, null, null);

        }

        //api use for update password due to email
        [HttpPost("update-pass")]
        public async Task<ApiResponse<string>> UpdatePassword(UpdatePasswordDTO user)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<string>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var result = await _userService.UpdatePasswordAsync(user);
            if (!result)
            {
                return new ApiResponse<string>(null, null, "400", "Update failed because email is invalid ", false, 0, 0, 0, 0, null, null, null);
            }
            return new ApiResponse<string>(null, null, "200", "Update password successfully", true, 0, 0, 0, 0, null, null, null);
        }

        //api admin use to view all user
        [HttpGet("get-alluser")]
        public async Task<ApiResponse<GetUserDTO>> GetAllUser()
        {
            var result = await _userService.GetAllUserAsync();
            return new ApiResponse<GetUserDTO>(result, null, "200", "Get all user successfully", true, 0, 0, 0, 0, null, null, null);
        }

        // add user
        [HttpPost("add-user")]
        public async Task<ApiResponse<GetUserDTO>> AddNewUser([FromBody] UserDTO user)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetUserDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var result = await _userService.AddNewUserAsync(user);
            if (result == null)
            {
                return new ApiResponse<GetUserDTO>(null, null, "400", "Add user failed due to invalid user", false, 0, 0, 0, 0, null, null, null);
            }
            return new ApiResponse<GetUserDTO>(null, result, "200", "Add user successfully", true, 0, 0, 0, 0, null, null, null);

        }

        //update user by admin
        [HttpPut("{id}")]
        public async Task<ApiResponse<GetUserDTO>> UpdateUser([FromRoute] Guid id, [FromBody] UserDTO user)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetUserDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var result = await _userService.UpdateUserByIdAsync(id, user);
            if (result == null)
            {
                return new ApiResponse<GetUserDTO>(null, null, "400", "User is not exist", false, 0, 0, 0, 0, null, null, null);
            }
            return new ApiResponse<GetUserDTO>(null, result, "200", "Update user successfully", true, 0, 0, 0, 0, null, null, null);
        }

        //delete user
        [HttpDelete("{id}")]
        public async Task<ApiResponse<GetUserDTO>> DeleteUserById([FromRoute] Guid id)
        {
            var result = await _userService.DeleteUserByIdAsync(id);
            if (result == null)
            {
                return new ApiResponse<GetUserDTO>(null, null, "400", "User is not exist", false, 0, 0, 0, 0, null, null, null);
            }
            return new ApiResponse<GetUserDTO>(null, result, "200", "Delete user successfully", true, 0, 0, 0, 0, null, null, null);
        }

        // view detail 1 user by admin
        [HttpGet("{id}")]
        public async Task<ApiResponse<GetUserDTO>> GetUserById([FromRoute] Guid id)
        {
            var result = await _userService.GetUserByIdAsync(id);
            if (result == null)
            {
                return new ApiResponse<GetUserDTO>(null, null, "400", "User is not exist", false, 0, 0, 0, 0, null, null, null);
            }
            return new ApiResponse<GetUserDTO>(null, result, "200", "Get user successfully", true, 0, 0, 0, 0, null, null, null);
        }

        // get user by page
        [HttpGet("by-page")]
        public async Task<ApiResponse<GetUserDTO>> GetUserByPage([FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            var totalUser = await _context.User.ToListAsync();
            var totalPages = (int)Math.Ceiling((double)totalUser.Count() / pageSize);
            var result = await _userService.GetUserByPageAsync(currentPage, pageSize);
            return new ApiResponse<GetUserDTO>(result, null, "200", "Get user successfully", true, currentPage, pageSize, totalPages, totalUser.Count(), null, null, null);
        }

        // user use api to change password
        [HttpPut("change-password")]
        public async Task<ApiResponse<string>> ChangePassword([FromBody] ChangePasswordDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return new ApiResponse<string>(null, null, "400", "User not exist", true, 0, 0, 0, 0, null, null, null);
            }

            var userId = Guid.Parse(userIdClaim.Value);

            var result = await _userService.ChangePasswordAsync(userId, dto);

            return result;
        }

        // update infor by user
        [HttpPut("by-user")]
        public async Task<ApiResponse<GetUserDTO>> UpdateInfoByUser( [FromBody] UserDTO user)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetUserDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var userId = Guid.Parse(userIdClaim.Value);
            var result = await _userService.UpdateUserByIdAsync(userId, user);
            if (result == null)
            {
                return new ApiResponse<GetUserDTO>(null, null, "400", "User is not exist", false, 0, 0, 0, 0, null, null, null);
            }
            return new ApiResponse<GetUserDTO>(null, result, "200", "Update user successfully", true, 0, 0, 0, 0, null, null, null);
        }
    }
}

