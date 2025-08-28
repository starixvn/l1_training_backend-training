namespace OW.ApiSimulator.Models.OW
{
    public class PlaceBetResult : OWResult
    {
        public int? ObTransId { get; set; }

        public int PlayerId { get; set; }

        public decimal Balance { get; set; }

        public decimal MinBet { get; set; }

        public decimal MaxBet { get; set; }
    }
}