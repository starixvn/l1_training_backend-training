using System;
using System.Collections.Generic;
using OW.ApiSimulator.Models.OW;

namespace OW.ApiSimulator.Models
{
    public class Operator
    {
        public Operator()
        {
        }

        public Operator(string name)
        {
            Name = name;
            Customers = new List<Customer>();
            EnterPortalResult = new EnterPortalResult();
            GetBalanceResult = new GetBalanceResult();
            PlaceBetResult = new PlaceBetResult();
            EndGameResult = new EndGameResult();
            VoidGameResult = new VoidGameResult();
            CheckMaintenanceResult = new CheckMaintenanceResult { StartTime = DateTimeOffset.UtcNow, EndTime = DateTimeOffset.UtcNow.AddHours(1) };
            GetBetLimitResult = new GetBetLimitResult();
            HitJackpotResult = new HitJackpotResult();
        }

        public string Name { get; set; }

        public List<Customer> Customers { get; set; }
        public EnterPortalResult EnterPortalResult { get; set; }
        public GetBalanceResult GetBalanceResult { get; set; }
        public PlaceBetResult PlaceBetResult { get; set; }
        public EndGameResult EndGameResult { get; set; }
        public VoidGameResult VoidGameResult { get; set; }
        public CheckMaintenanceResult CheckMaintenanceResult { get; set; }
        public GetBetLimitResult GetBetLimitResult { get; set; }
        public HitJackpotResult HitJackpotResult { get; set; }
    }
}