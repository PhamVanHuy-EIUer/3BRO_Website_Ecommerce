using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class RoleRepository : IRoleRepository
    {
        private readonly Ecommerce3BROContext _context;
        public RoleRepository(Ecommerce3BROContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<GetRoleDTO>> AddNewRoleAsync(RoleDTO role)
        {
            var newRole = new Role()
            {
                Description = role.Description,
                RoleName = role.RoleName,
                CreatedDate = DateTime.UtcNow,
                
            };
            await _context.Role.AddAsync(newRole);
            await _context.SaveChangesAsync();
            var getRoleDto = new GetRoleDTO()
            {
                Id = newRole.Id,
                RoleName = newRole.RoleName,
                Description = newRole.Description,
                CreatedDate = newRole.CreatedDate
            };
            return new ApiResponse<GetRoleDTO>(null, getRoleDto, "200", "Add new role successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetRoleDTO>> ApplyRoleForUser(Guid userId, Guid roleId)
        {
            var userRole = new UserRole()
            {
                UserId = userId,
                CreatedDate = DateTime.UtcNow,
                RoleId = roleId,
                
            };
            await _context.UserRole.AddAsync(userRole);
            await _context.SaveChangesAsync();
            return new ApiResponse<GetRoleDTO>(null, null, "200", "Apply role for user successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetRoleDTO>> DeleteRole(Guid roleId)
        {
            var findRole = await _context.Role.FindAsync(roleId);
            if (findRole == null)
            {
                return new ApiResponse<GetRoleDTO>(null, null, "404", "Role not found", false, 0, 0, 0, 0, null, null, null);
            }
            var findUserRole = await _context.UserRole.Where(ur => ur.RoleId == roleId).ToListAsync();
            if (findUserRole.Count > 0)
            {
                _context.UserRole.RemoveRange(findUserRole);
            }
            _context.Remove(findRole);
            await _context.SaveChangesAsync();
            return new ApiResponse<GetRoleDTO>(null, null, "200", "Delete role successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetRoleDTO>> GetAllRoleAsync()
        {
            var roles = _context.Role.Select(r => new GetRoleDTO()
            {
                Id = r.Id,
                RoleName = r.RoleName,
                Description = r.Description,
                CreatedDate = r.CreatedDate
            }).ToList();
            return new ApiResponse<GetRoleDTO>(roles, null, "200", "Get all roles successfully", true, 0, 0, 0, 0, null, null, null);
        }
    }
}
