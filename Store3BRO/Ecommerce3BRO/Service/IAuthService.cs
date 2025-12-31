namespace Ecommerce3BRO.Service
{
    public interface IAuthService
    {
        string? GenerateAccessToken(string email, Guid id, List<string> roles);
        Task<List<string>?> GetRolesByUser(string email);
    }
}
