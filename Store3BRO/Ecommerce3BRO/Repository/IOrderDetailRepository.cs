using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IOrderDetailRepository
    {
        Task<ApiResponse<string>> RemoveOrderDetailAsync(Guid orderDetailId);
    }
}
