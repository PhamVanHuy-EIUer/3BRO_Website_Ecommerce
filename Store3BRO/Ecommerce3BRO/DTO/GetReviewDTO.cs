namespace Ecommerce3BRO.DTO
{
    public class GetReviewDTO
    {
        public Guid ReviewId { get; set; }
        public Guid ProductId { get; set; }
        public string ReviewName { get; set; }
        public string PhoneNumber { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime? ReviewDate { get; set; }
        public string ProductName { get; set; } 

    }
}
