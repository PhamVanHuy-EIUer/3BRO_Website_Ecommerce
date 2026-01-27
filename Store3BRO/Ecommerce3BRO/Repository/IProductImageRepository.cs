using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Repository
{
    public interface IProductImageRepository
    {
        Task<ApiResponse<GetProductImageDTO>> AddNewImageForProductAsync(Guid productId, List<IFormFile> newImages);
        Task<ApiResponse<GetProductImageDTO>> RemoveImageFromProductAsync(Guid imageId);
        Task<ApiResponse<GetProductImageDTO>> GetAllImagesByProductIdAsync(Guid productId);

    }
}
