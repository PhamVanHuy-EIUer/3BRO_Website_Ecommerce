using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Repository;
using Ecommerce3BRO.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce3BRO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : Controller
    {
        private readonly IRoleRepository _roleRepository;
        public RolesController(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }
        [HttpGet]
        [Authorize(Roles ="Admin")]
        public async Task<ApiResponse<GetRoleDTO>> GetAllRoles()
        {
            var result = await _roleRepository.GetAllRoleAsync();
            return result;
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetRoleDTO>> AddNewRole([FromBody] RoleDTO role)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse<GetRoleDTO>(null, null, "400", "Invalid information", false, 0, 0, 0, 0, null, null, ModelState.ToDictionary(
            x => x.Key,
            x => x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        ));
            }
            var result = await _roleRepository.AddNewRoleAsync(role);
            return result;
        }
        [HttpPost("apply-roleUser")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetRoleDTO>> ApplyRoleForUser([FromQuery] Guid userId, [FromQuery] Guid roleId)
        {
            var result = await _roleRepository.ApplyRoleForUser(userId, roleId);
            return result;
        }
        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<GetRoleDTO>> DeleteRole([FromQuery] Guid roleId)
        {
            var result = await _roleRepository.DeleteRole(roleId);
            return result;
        }
    }
}
