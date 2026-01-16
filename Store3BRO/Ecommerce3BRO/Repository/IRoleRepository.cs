using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Ecommerce3BRO.Repository
{
    public interface IRoleRepository
    {
        Task<ApiResponse<GetRoleDTO>> AddNewRoleAsync(RoleDTO role);
        Task<ApiResponse<GetRoleDTO>> DeleteRole(Guid roleId);
        Task<ApiResponse<GetRoleDTO>> ApplyRoleForUser(Guid userId, Guid roleId);
        Task<ApiResponse<GetRoleDTO>> GetAllRoleAsync();
    }
}
