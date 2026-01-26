using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce3BRO.Repository.Implement
{
    public class SupportRepository : ISupportRepository
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IEmailService _emailService;
        public SupportRepository(Ecommerce3BROContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<ApiResponse<GetSupportDTO>> AddNewContactAsync(SupportDTO support)
        {
            var newContact = new Support()
            {
                CreatedDate = DateTime.UtcNow,
                Email = support.Email,
                Message = support.Message,
                Subject = support.Subject,
                Name = support.Name,
            };
            await _context.Support.AddAsync(newContact);
            await _context.SaveChangesAsync();
            var dto = new GetSupportDTO()
            {
                CreatedDate = newContact.CreatedDate,
                Email = newContact.Email,
                Id = newContact.Id,
                Name = newContact.Name,
                Subject = newContact.Subject
            };
            return new ApiResponse<GetSupportDTO>(null, dto, "200", "Add new contact successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetSupportDTO>> DeleteContactAsync(Guid id)
        {
            var findContact = await _context.Support.FindAsync(id);
            if (findContact == null)
            {
                return new ApiResponse<GetSupportDTO>(null, null, "404", "Contact not found", false, 0, 0, 0, 0, null, null, null);
            }
            _context.Support.Remove(findContact);
            await _context.SaveChangesAsync();
            return new ApiResponse<GetSupportDTO>(null, null, "200", "Delete contact successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetSupportDTO>> GetAllUserContactAsync()
        {
            var contacts = await _context.Support.Select(c => new GetSupportDTO
            {
                CreatedDate = c.CreatedDate,
                Email = c.Email,
                Id = c.Id,
                Name = c.Name,
                Subject = c.Subject
            }).ToListAsync();
            return new ApiResponse<GetSupportDTO>(contacts, null, "200", "Get all contact successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetSupportDTO>> GetAllUserContactPyPagesAsync(int currentPage, int pageSize)
        {
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;
            var totalItems = _context.Support.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var contacts = await _context.Support.OrderByDescending(c => c.CreatedDate)
                .Skip((currentPage - 1) * pageSize).Take(pageSize).Select(c => new GetSupportDTO
                {
                    CreatedDate = c.CreatedDate,
                    Email = c.Email,
                    Id = c.Id,
                    Name = c.Name,
                    Subject = c.Subject
                }).ToListAsync();
            return new ApiResponse<GetSupportDTO>(contacts, null, "200", "Get all contact by pages successfully", true, currentPage, pageSize, totalPages, totalItems, null, null, null);
        }

        public async Task<ApiResponse<Support>> GetContactDetailAsync(Guid id)
        {
            var findContact = await _context.Support.FindAsync(id);
            if (findContact == null)
            {
                return new ApiResponse<Support>(null, null, "404", "Contact not found", false, 0, 0, 0, 0, null, null, null);
            }
            return new ApiResponse<Support>(null, findContact, "200", "Get contact detail successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<Support>> SendResponeAsync(ResponseDTO response)
        {
            await _emailService.SendEmailForContactAsync(response.Email, response.Response);
            return new ApiResponse<Support>(null, null, "200", "Send response successfully", true, 0, 0, 0, 0, null, null, null);
        }
    }
}
