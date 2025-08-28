using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace OW.ApiSimulator.Controllers
{
    public class HomeController : ControllerBase
    {
        [AllowAnonymous]
        [Route("healthcheck")]
        public ActionResult Index() => new ContentResult()
        {
            Content = "OW API is running!!!",
            ContentType = "text/html"
        };
    }
}