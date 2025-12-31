using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Ecommerce3BRO.Repository.Implement
{
    public class UserRepository : IUserRepository
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IEmailService _emailService;
        public UserRepository(Ecommerce3BROContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<UserDTO?> ActiveUserAsync(Guid id, string activeCode)
        {
            var findUser = await _context.User.FindAsync(id);
            var findActivecode = await _context.ActivationCode.FirstOrDefaultAsync(a => a.Code == activeCode && a.IsUsed == false);
            if (findUser == null)
            {
                return null;
            }
            findUser.IsActive = true;
            findActivecode.IsUsed = true;
            UserDTO userDTO = new UserDTO()
            {
                Email = findUser.Email,
            };
            await _context.SaveChangesAsync();
            return userDTO;

        }

        public async Task<GetUserDTO?> AddNewUserAsync(UserDTO user)
        {
            if (user == null)
            {
                return null;
            }
            User newUser = new User()
            {
                Address = user.Address,
                CreatedDate = DateTime.UtcNow,
                Email = user.Email,
                FullName = user.FullName,
                IsActive = false,
                Phone = user.Phone,
                Password = "123456789"
            };
            await _context.User.AddAsync(newUser);
            await _context.SaveChangesAsync();
            GetUserDTO getUserDTO = new GetUserDTO()
            {
                Id = newUser.Id,
                Address = newUser.Address,
                CreatedDate = newUser.CreatedDate,
                Email = newUser.Email,
                FullName = newUser.FullName,
                IsActive = newUser.IsActive,
                Phone = newUser.Phone
            };
            return getUserDTO;
        }

        public async Task<ApiResponse<string>> ChangePasswordAsync(Guid id,ChangePasswordDTO user)
        {
            var findUser = await _context.User.FindAsync(id);
            if(findUser == null)
            {
                return new ApiResponse<string>(null, null, "400", "User is not exist", false, 0, 0, 0, 0, null, null, null);
            }
            bool CheckPass = BCrypt.Net.BCrypt.Verify(user.CurrentPassword, findUser.Password);
            if (!CheckPass)
            {
                return new ApiResponse<string>(null, null, "400", "Password is wrong ", false, 0, 0, 0, 0, null, null, null);
            }
            if(user.NewPassword != user.ConfirmNewPassword)
            {
                return new ApiResponse<string>(null, null, "400", "Confirm password is failed ", false, 0, 0, 0, 0, null, null, null);
            }
            findUser.Password = BCrypt.Net.BCrypt.HashPassword(user.NewPassword);
            await _context.SaveChangesAsync();
            return new ApiResponse<string>(null, null, "200", "Change password successfully", true, 0, 0, 0, 0, null, null, null);
        }
           
        


        public async Task<GetUserDTO?> DeleteUserByIdAsync(Guid id)
        {
            var findUser = await _context.User.FindAsync(id);
            if (findUser == null)
            {
                return null;
            }
            findUser.IsDeleted = true;
            var orders = await _context.Order.Where(o => o.UserId == id).ToListAsync();
            foreach (var order in orders)
            {
                order.Status = 5;
                var shipments = await _context.Shipment.Where(s => s.OrderId == order.Id).ToListAsync();
                foreach (var shipment in shipments)
                {
                    shipment.Status = 0;
                }
                var payments = await _context.Payment.Where(p => p.OrderId == order.Id).ToListAsync();
                foreach (var payment in payments)
                {
                    payment.Status = 0;
                }
            }
            var carts = await _context.Cart.Where(c => c.UserId == id).ToListAsync();
            foreach (var cart in carts)
            {
                cart.IsDeleted = true;
            }
            await _context.SaveChangesAsync();
            GetUserDTO getUserDTO = new GetUserDTO()
            {
                Id = findUser.Id,
                Address = findUser.Address,
                CreatedDate = findUser.CreatedDate,
                Email = findUser.Email,
                FullName = findUser.FullName,
                IsActive = findUser.IsActive,
                Phone = findUser.Phone
            };
            return getUserDTO;

        }

        public async Task<UserDTO?> ForgetPasswordAsync(string email)
        {
            var findUser = await _context.User.FirstOrDefaultAsync(fu => fu.Email == email);
            if (findUser == null)
            {
                return null;
            }
            string timePart = DateTime.UtcNow.ToString("HHmmss");
            int randomPart = RandomNumberGenerator.GetInt32(0, 100);
            string code = timePart + randomPart.ToString("D2");
            ActivationCode newCode = new ActivationCode()
            {
                UserId = findUser.Id,
                Code = code,
                CreatedDate = findUser.CreatedDate,
                ExpireDate = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false
            };
            await _context.ActivationCode.AddAsync(newCode);
            await _context.SaveChangesAsync();
            await _emailService.SendEmailAsync(findUser.Email, code);
            UserDTO UserDTO = new UserDTO()
            {
                Address = findUser.Address,
                Email = findUser.Email,
                FullName = findUser.FullName,
                Phone = findUser.Phone
            };
            return UserDTO;
        }

        public async Task<IEnumerable<GetUserDTO>> GetAllUserAsync()
        {
            var list = await _context.User.Where(u=>u.IsDeleted==false).Select(u => new GetUserDTO()
            {
                Id = u.Id,
                Address = u.Address,
                Email = u.Email,
                IsActive = u.IsActive,
                CreatedDate = u.CreatedDate,
                FullName = u.FullName,
                Phone = u.Phone
            }).ToListAsync();
            return list;
        }

        public async Task<GetUserDTO?> GetUserByIdAsync(Guid id)
        {
            var findUser = await _context.User.FindAsync(id);
            if (findUser == null)
            {
                return null;
            }
            GetUserDTO getUserDTO = new GetUserDTO()
            {
                Id = findUser.Id,
                Address = findUser.Address,
                CreatedDate = findUser.CreatedDate,
                Email = findUser.Email,
                FullName = findUser.FullName,
                IsActive = findUser.IsActive,
                Phone = findUser.Phone
            };
            return getUserDTO;
        }

        public async Task<IEnumerable<GetUserDTO>> GetUserByPageAsync(int currentPage, int pageSize)
        {
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;
            var listOfPage = await _context.User.Where(u => u.IsDeleted == false)
       .OrderByDescending(u => u.CreatedDate)
       .Skip((currentPage - 1) * pageSize)
       .Take(pageSize)
       .Select(u => new GetUserDTO
       {
           Id = u.Id,
           Address = u.Address,
           Email = u.Email,
           IsActive = u.IsActive,
           CreatedDate = u.CreatedDate,
           FullName = u.FullName,
           Phone = u.Phone
       })
       .ToListAsync();
            return listOfPage;
        }

        public async Task<UserDTO?> LoginAsync(LoginModel login)
        {
            var findUser = await _context.User.FirstOrDefaultAsync(fu => fu.Email == login.Email);
            if (findUser == null)
            {
                return null;
            }
            bool verifyPass = BCrypt.Net.BCrypt.Verify(login.Password, findUser.Password);
            if (!verifyPass)
            {
                return null;
            }
            UserDTO userDTO = new UserDTO()
            {
                Address = findUser.Address,
                Email = findUser.Email,
                FullName = findUser.FullName,
                Phone = findUser.Phone
            };
            return userDTO;
        }

        public async Task<GetUserDTO?> RegisterAsync(RegisterModel user)
        {
            var findUser = await _context.User.FirstOrDefaultAsync(u => u.Email == user.Email);
            string timePart = DateTime.UtcNow.ToString("HHmmss");
            int randomPart = RandomNumberGenerator.GetInt32(0, 100);
            string code = timePart + randomPart.ToString("D2");
            if (findUser != null && findUser.IsActive == false)
            {
                GetUserDTO availableUser = new GetUserDTO()
                {
                    Id = findUser.Id,
                    Address = findUser.Address,
                    CreatedDate = findUser.CreatedDate,
                    Email = findUser.Email,
                    FullName = findUser.FullName,
                    IsActive = findUser.IsActive,
                    Phone = findUser.Phone
                };
                ActivationCode newCode = new ActivationCode()
                {
                    UserId = findUser.Id,
                    Code = code,
                    CreatedDate = findUser.CreatedDate,
                    ExpireDate = DateTime.UtcNow.AddMinutes(5),
                    IsUsed = false
                };
                await _context.ActivationCode.AddAsync(newCode);
                await _context.SaveChangesAsync();
                await _emailService.SendEmailAsync(findUser.Email, code);
                return availableUser;
            }
            string hassPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
            User newUser = new User()
            {
                Email = user.Email,
                Password = hassPassword,
                CreatedDate = DateTime.UtcNow,
                IsActive = false
            };
            await _context.User.AddAsync(newUser);
            await _context.SaveChangesAsync();
            ActivationCode activationCode = new ActivationCode()
            {
                UserId = newUser.Id,
                Code = code,
                CreatedDate = newUser.CreatedDate,
                ExpireDate = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false
            };
            await _context.ActivationCode.AddAsync(activationCode);
            var role = await _context.Role.FirstOrDefaultAsync(r => r.RoleName == "User");
            UserRole userRole = new UserRole()
            {
                CreatedDate = DateTime.UtcNow,
                RoleId = role.Id,
                UserId = newUser.Id
            };
            await _context.UserRole.AddAsync(userRole);
            await _context.SaveChangesAsync();
            GetUserDTO getUserDTO = new GetUserDTO()
            {
                Id = newUser.Id,
                Address =newUser.Address,
                CreatedDate = newUser.CreatedDate,
                Email = newUser.Email,
                FullName = newUser.FullName,
                IsActive = newUser.IsActive,
                Phone = newUser.Phone
            };
            await _emailService.SendEmailAsync(newUser.Email, code);
            return getUserDTO;
        }

        public async Task SendActiveCodeAsync(Guid id)
        {
            string timePart = DateTime.UtcNow.ToString("HHmmss");
            int randomPart = RandomNumberGenerator.GetInt32(0, 100);
            string code = timePart + randomPart.ToString("D2");
            ActivationCode activationCode = new ActivationCode()
            {
                UserId = id,
                Code = code,
                CreatedDate = DateTime.Now,
                ExpireDate = DateTime.Now.AddMinutes(5),
                IsUsed = false
            };
            await _context.ActivationCode.AddAsync(activationCode);
            await _context.SaveChangesAsync();
            var findUser = await _context.User.FindAsync(id);
            await _emailService.SendEmailAsync(findUser.Email, code);
        }

        public async Task<bool> UpdatePasswordAsync(UpdatePasswordDTO user)
        {
            var findUser = await _context.User.FirstOrDefaultAsync(fu => fu.Email == user.Email);
            if (findUser == null)
            {
                return false;
            }
            findUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<GetUserDTO?> UpdateUserByIdAsync(Guid id, UserDTO user)
        {
            var findUser = await _context.User.FindAsync(id);
            if (findUser == null)
            {
                return null;
            }
            findUser.CreatedDate = DateTime.Now;
            findUser.Email = user.Email;
            findUser.Address = user.Address;
            findUser.Phone = user.Phone;
            findUser.FullName = user.FullName;
            GetUserDTO getUserDTO = new GetUserDTO()
            {
                Id = findUser.Id,
                Address = findUser.Address,
                CreatedDate = findUser.CreatedDate,
                Email = findUser.Email,
                FullName = findUser.FullName,
                IsActive = findUser.IsActive,
                Phone = findUser.Phone
            };
            try
            {
                await _context.SaveChangesAsync();
                return getUserDTO;
            }
            catch (DbUpdateConcurrencyException)
            {
                return null;
            }

        }

        public async Task<UserDTO?> VerifyActivationCodeAsync(ForgetPasswordDTO user)
        {
            var findUser = await _context.User.FirstOrDefaultAsync(fu => fu.Email == user.Email);
            var findAcitvationCode = await _context.ActivationCode.FirstOrDefaultAsync(a => a.Code == user.Code && a.ExpireDate > DateTime.UtcNow && a.IsUsed == false);
            if (findUser == null || findAcitvationCode == null || findAcitvationCode.UserId != findUser.Id)
            {
                return null;
            }
            findAcitvationCode.IsUsed = true;
            await _context.SaveChangesAsync();
            UserDTO UserDTO = new UserDTO()
            {
                Address = findUser.Address,
                Email = findUser.Email,
                FullName = findUser.FullName,
                Phone = findUser.Phone
            };
            return UserDTO;
        }
    }
}
