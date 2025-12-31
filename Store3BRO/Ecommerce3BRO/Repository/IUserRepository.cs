using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IUserRepository
    {
        Task<GetUserDTO?> RegisterAsync(RegisterModel user);
        Task<UserDTO?> ActiveUserAsync(Guid id, string activeCode);
        Task  SendActiveCodeAsync(Guid id);
        Task<UserDTO?> ForgetPasswordAsync(string email);
        Task<bool> UpdatePasswordAsync(UpdatePasswordDTO user);
        Task<UserDTO?> VerifyActivationCodeAsync (ForgetPasswordDTO user);
        Task<UserDTO?> LoginAsync(LoginModel login);
        Task<IEnumerable<GetUserDTO>> GetAllUserAsync();
        Task<GetUserDTO?> AddNewUserAsync(UserDTO user);
        Task<GetUserDTO?> UpdateUserByIdAsync(Guid id, UserDTO user);
        Task<GetUserDTO?> DeleteUserByIdAsync(Guid id);
        Task<GetUserDTO?> GetUserByIdAsync(Guid id);
        Task<IEnumerable<GetUserDTO>> GetUserByPageAsync(int currentPage, int pageSize);
        Task<ApiResponse<string>> ChangePasswordAsync(Guid id,ChangePasswordDTO user);
    }
}
