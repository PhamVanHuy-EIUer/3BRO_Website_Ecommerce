namespace Ecommerce3BRO.Model
{
    public class UserLocation
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
