namespace Ecommerce3BRO.DTO
{
    public class GetReviewDetailDTO
    {
        public string ReviewName { get; set; }
        public string PhoneNumber { get; set; }
        public int Rating { get; set; }
        public string ProductName { get; set; }
        public string Comment { get; set; }
        public DateTime? ReviewDate { get; set; }
    }
}
