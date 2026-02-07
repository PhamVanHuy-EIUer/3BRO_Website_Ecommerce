namespace Ecommerce3BRO.DTO
{
    public class TotalSaleDTO
    {
        public string Month {  get; set; }
        public  int Year { get; set; }
        public decimal TotalSale { get; set; } = 0; 
        public int NumOfProduct { get; set; }
    }
}
