using Ecommerce3BRO.Service;

namespace Ecommerce3BRO.Helper
{
    public static class GeoHelper
    {
        private const double EarthRadiusKm = 6371;

        public static double CalculateDistance(
            double lat1, double lon1,
            double lat2, double lon2)
        {
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);

            lat1 = ToRadians(lat1);
            lat2 = ToRadians(lat2);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(lat1) * Math.Cos(lat2) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            Console.WriteLine("KM is"+EarthRadiusKm * c);
            return EarthRadiusKm * c; 
        }

        private static double ToRadians(double deg)
        {
            return deg * Math.PI / 180;
        }
    }
}
