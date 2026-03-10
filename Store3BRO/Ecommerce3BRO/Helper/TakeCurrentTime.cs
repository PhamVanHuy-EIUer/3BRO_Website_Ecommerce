namespace Ecommerce3BRO.Helper
{
    public class TakeCurrentTime
    {
        public DateTime StartOfCurrentMonth()
        {
            var nowUtc = DateTime.UtcNow;

            return new DateTime(
                nowUtc.Year,
                nowUtc.Month,
                1,
                0, 0, 0,
                DateTimeKind.Utc
            );
        }

        public DateTime StartOfSixMonthAgo()
        {
            var nowUtc = DateTime.UtcNow;

            var startOfCurrentMonth = new DateTime(
                nowUtc.Year,
                nowUtc.Month,
                1,
                0, 0, 0,
                DateTimeKind.Utc
            );

            return startOfCurrentMonth.AddMonths(-5); // 5 tháng trước + tháng hiện tại = 6
        }
    }
}
