using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface ISupportRepository
    {
        Task<ApiResponse<GetSupportDTO>> GetAllUserContactAsync();
        Task<ApiResponse<Support>> GetContactDetailAsync(Guid id);
        Task<ApiResponse<GetSupportDTO>> AddNewContactAsync(SupportDTO support);
        Task<ApiResponse<GetSupportDTO>> DeleteContactAsync(Guid id);
        Task<ApiResponse<Support>> SendResponeAsync(ResponseDTO response);
        Task<ApiResponse<GetSupportDTO>> GetAllUserContactPyPagesAsync(int currentPage, int pageSize);
    }
}
