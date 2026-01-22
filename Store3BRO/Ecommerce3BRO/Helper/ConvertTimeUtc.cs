namespace Ecommerce3BRO.Helper
{
    public static class DateTimeHelper
    {
        public static DateTime NormalizeUtc(DateTime dt)
        {
            return dt.Kind switch
            {
                DateTimeKind.Utc => dt,
                DateTimeKind.Local => dt.ToUniversalTime(),
                DateTimeKind.Unspecified => DateTime.SpecifyKind(dt, DateTimeKind.Utc),
                _ => dt
            };
        }
    }
}