using System;

namespace OW.ApiSimulator.Models.OW
{
    public class OWCall
    {
        public string Seq { get; set; }

        public int PlayerId { get; set; }

        public string SiteId { get; set; }

        public DateTimeOffset TimeStamp { get; set; }
    }
}