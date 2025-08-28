namespace OW.ApiSimulator.Models.OW
{
    public class LoginCall
    {
        public Auth Auth { get; set; }

        public Call Call { get; set; }
    }

    public class Auth
    {
        public string Login { get; set; }

        public string Password { get; set; }
    }

    public class Call
    {
        public string Seq { get; set; }

        public string SiteId { get; set; }

        public int ObCustId { get; set; }

        public string ObCustName { get; set; }

        public string Language { get; set; }

        public int GameId { get; set; }

        public string Currency { get; set; }

        public string Ip { get; set; }

        public string BrowserUserAgent {get;set;}

        public string BetFrom { get; set; }

        public string Platform { get; set; }

        public string SiteName { get; set; }

        public string Location { get; set; }

        public bool? IsMobi { get; set; }

        public string AppType { get; set; }

        public bool? IsMega { get; set; }

    }

}
