namespace Ecommerce3BRO.Service
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string activeCode);
        Task SendEmailForContactAsync(string toEmail, string response);
    }
}
