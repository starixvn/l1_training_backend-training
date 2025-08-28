
using System.Text.Json.Serialization;

namespace OW.ApiSimulator.Models.OW
{
    public class OWResult
    {
        public string Seq { get; set; }

        public int ErrorCode { get; set; }

        public string ErrorDescription { get; set; }

        [JsonIgnore]
        public int DelayTime { get; set; }
    }
}