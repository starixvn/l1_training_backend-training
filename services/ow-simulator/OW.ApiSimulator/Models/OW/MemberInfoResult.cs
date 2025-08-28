namespace OW.ApiSimulator.Models.OW
{
    public class MemberInfoResult : OWResult
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Currency { get; set; }
        public string SiteName { get; set; }
    }
}