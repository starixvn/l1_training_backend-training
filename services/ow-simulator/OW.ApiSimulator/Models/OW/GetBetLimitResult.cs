namespace OW.ApiSimulator.Models.OW
{
    public class GetBetLimitResult : OWResult
    {
        public decimal MinBet { get; set; }

        public decimal MaxBet { get; set; }
    }
}