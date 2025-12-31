using System.Net;
using System.Net.Mail;

namespace Ecommerce3BRO.Service.Implement
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string activeCode)
        {
            var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(
                    _config["EmailSettings:Username"],
                    _config["EmailSettings:Password"]
                )
            };

            var message = new MailMessage
            {
                From = new MailAddress(_config["EmailSettings:Username"]),
                Subject = "Mã kích hoạt tài khoản",
                Body = $"Mã kích hoạt của bạn là: {activeCode}"
            };

            message.To.Add(toEmail);

            await smtp.SendMailAsync(message);
        }
    }
}
