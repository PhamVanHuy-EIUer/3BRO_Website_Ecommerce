namespace Ecommerce3BRO.Helper
{
    public class TakeCurrentTime
    {
        public DateTime currentime()
        {
            var nowUtc = DateTime.UtcNow;

            var startOfCurrentMonth = new DateTime(
                nowUtc.Year,
                nowUtc.Month,
                1,
                0, 0, 0,
                DateTimeKind.Utc
            );
            return startOfCurrentMonth;
        }

        public DateTime sixPastTime()
        {
            var nowUtc = DateTime.UtcNow;

            var startOfCurrentMonth = new DateTime(
                nowUtc.Year,
                nowUtc.Month,
                1,
                0, 0, 0,
                DateTimeKind.Utc
            );

            var fromDate = startOfCurrentMonth.AddMonths(-6);
            return fromDate;
        }

    }
}
