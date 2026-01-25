namespace Ecommerce3BRO.Helper
{
    public static class CountShippingFee
    {
        public static decimal CountFee(
            double lat1, double lon1,
            double lat2, double lon2)
        {
            double distance = GeoHelper.CalculateDistance(lat1, lon1, lat2, lon2);

            decimal baseFee = 15000;       
            double freeKm = 3;             
            decimal pricePerKm = 5000;     
            decimal maxFee = 100000;      

            if (distance <= freeKm)
                return baseFee;

            double extraKm = Math.Ceiling(distance - freeKm);

            decimal fee = baseFee + (decimal)extraKm * pricePerKm;

            return Math.Min(fee, maxFee);
        }
    }
}
