using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using OW.ApiSimulator._Shared;
using OW.ApiSimulator.Models;
using OW.ApiSimulator.Models.OW;

namespace OW.ApiSimulator.Controllers
{
    [Route("{operator}/[controller]/[action]")]
    public class SabaClubController : Controller
    {
        private const string SC1 = "SC1";
        private readonly IServiceProvider serviceProvider;
        private readonly IAppSettings appSettings;

        public SabaClubController(IServiceProvider serviceProvider, IAppSettings appSettings)
        {
            this.serviceProvider = serviceProvider;
            this.appSettings = appSettings;
        }

        [HttpGet]
        [Route("/[controller]/[action]")]
        [Route("/[controller]")]
        [Route("/")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("/[controller]/[action]")]
        public IActionResult CreateCustomer(int memId, string @operator, string siteId, string systemType = "SC1")
        {
            var selectedOperator = GetOperator(@operator);
            var customer = selectedOperator?.Customers.FirstOrDefault(x => x.PlayerId == memId);

            return View(customer ??
                new Customer
                {
                    PlayerId = memId,
                    Username = $"username_{memId}",
                    Balance = 2000,
                    MinBet = (systemType.Equals(SC1) ? 1 : 10),
                    MaxBet = (systemType.Equals(SC1) ? 3000 : 20000),
                    Currency = (systemType.Equals(SC1) ? "$US" : "INH"),
                    SiteId = siteId,
                });
        }

        [HttpPost]
        [Route("/[controller]/[action]")]
        public IActionResult CreateCustomer(Customer model)
        {
            var forcedToUseOWOperator = Constants.ForcedToUseOWOperatorsMapper.FirstOrDefault(_operator => _operator.Key == model.Operator);
            if(forcedToUseOWOperator.Key != null)
            {
                model.Operator = forcedToUseOWOperator.Value;
            }
          
            var selectedOperator = GetOperator(model.Operator);

            selectedOperator.Customers.RemoveAll(x => x.PlayerId == model.PlayerId && x.SiteId == model.SiteId);
            selectedOperator.Customers.Add(model);

            return View(model);
        }

        [HttpPost]
        [Route("/[controller]/[action]")]
        public IActionResult SetDefaultBalance(
            [FromQuery] int playerId,
            [FromQuery] string username,
            [FromQuery] string @operator,
            [FromQuery] string currency,
            [FromQuery] string siteId,
            [FromQuery] int balance = 2000,
            [FromQuery] string systemType = "SC1")
        {
            var selectedOperator = GetOperator(@operator);
            var player = selectedOperator.Customers.FirstOrDefault(x => x.PlayerId == playerId && x.SiteId == siteId)
                ?? new Customer
                {
                    Operator = @operator,
                    PlayerId = playerId,
                    Username = username,
                    Balance = 2000,
                    MinBet = (systemType.Equals(SC1) ? 1 : 10),
                    MaxBet = (systemType.Equals(SC1) ? 3000 : 20000),
                    SiteId = siteId
                };
            player.Currency = currency ?? (systemType.Equals(SC1) ? "$US" : "INH");
            player.Username = username;
            player.Balance = balance;
            selectedOperator.Customers.RemoveAll(x => x.PlayerId == playerId && x.SiteId == siteId);
            selectedOperator.Customers.Add(player);

            return Json(true);
        }

        [HttpGet]
        [Route("/[controller]/[action]")]
        public IActionResult UpdateCustomerBalance()
        {
            var operators = serviceProvider.GetRequiredService<List<Operator>>();
            return View(operators.SelectMany(x => x.Customers).ToList());
        }

        [HttpPost]
        [Route("/[controller]/[action]")]
        public IActionResult UpdateCustomerBalance(IEnumerable<Customer> model)
        {
            var operators = serviceProvider.GetRequiredService<List<Operator>>();
            foreach (var updateCustomer in model)
            {
                var @operator = operators.FirstOrDefault(x => x.Name == updateCustomer.Operator);
                var customer = @operator.Customers.FirstOrDefault(x => x.PlayerId == updateCustomer.PlayerId);
                customer.Balance = updateCustomer.Balance;
                customer.MinBet = updateCustomer.MinBet;
                customer.MaxBet = updateCustomer.MaxBet;
            }

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> EnterPortal([FromBody] EnterPortalCall request, [FromRoute] string @operator)
        {
            var selectedOperator = GetOperator(@operator);
            var result = selectedOperator.EnterPortalResult;
            var loginCustomer = selectedOperator.Customers.FirstOrDefault(x => x.PlayerId == request.PlayerId && x.SiteId == request.SiteId);

            if (result.ErrorCode == 0)
            {
                result.MinBet = loginCustomer?.MinBet ?? 0;
                result.MaxBet = loginCustomer?.MaxBet ?? 0;
            }
            else
            {
                result.MinBet = result.MaxBet = 0;
            }

            result.Seq = request.Seq;

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<EnterPortalResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> GetBalance([FromBody] GetBalanceCall request, [FromRoute] string @operator)
        {
            var selectedOperator = GetOperator(@operator);
            var customer = selectedOperator.Customers.FirstOrDefault(x => x.PlayerId == request.PlayerId && x.SiteId == request.SiteId);

            var result = new GetBalanceResult();

            var resultTemplate = selectedOperator.GetBalanceResult;
            result.Seq = request.Seq;

            if (resultTemplate.ErrorCode == 0 && customer != null)
            {
                result.Balance = customer.Balance;
            }
            else
            {
                result.Balance = 0;
                result.ErrorDescription = resultTemplate.ErrorDescription;
            }

            var delayTime = customer?.Delay.GetBalance > 0 ? customer.Delay.GetBalance : resultTemplate.DelayTime;
            result.ErrorCode = customer?.ErrorCode.GetBalance > 0 ? customer.ErrorCode.GetBalance : resultTemplate.ErrorCode;

            await Task.Delay(delayTime);

            return Ok(new OWResponse<GetBalanceResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> PlaceBet([FromBody] PlaceBetCall request, [FromRoute] string @operator)
        {
            var selectedOperator = GetOperator(@operator);
            var customer = selectedOperator.Customers.FirstOrDefault(x => x.PlayerId == request.PlayerId && x.SiteId == request.SiteId);

            var result = new PlaceBetResult();
            var resultTemplate = selectedOperator.PlaceBetResult;
            result.Seq = request.Seq;

            var delayTime = customer?.Delay.PlaceBet > 0 ? customer.Delay.PlaceBet : resultTemplate.DelayTime;
            result.ErrorCode = GetPlaceBetErrorCode(resultTemplate, customer, request.Amount);

            if (result.ErrorCode == 0 && customer != null)
            {
                result.PlayerId = request.PlayerId;

                if (request.Amount <= customer.Balance)
                {
                    customer.Balance -= request.Amount;
                    result.Balance = customer.Balance;
                }
            }
            else
            {
                result.Balance = 0;
            }

            if (result.ErrorCode == 0 || result.ErrorCode == 3003 || result.ErrorCode == 3009 || result.ErrorCode == 3002)
            {
                result.MinBet = customer?.MinBet ?? 0;
                result.MaxBet = customer?.MaxBet ?? 0;
            }
            else
            {
                result.MinBet = result.MaxBet = 0;
            }

            await Task.Delay(delayTime);

            return Ok(new OWResponse<PlaceBetResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        private static int GetPlaceBetErrorCode(PlaceBetResult result, Customer customer, decimal amount)
        {
            var errorCode = customer?.ErrorCode.PlaceBet > 0 ? customer.ErrorCode.PlaceBet : result.ErrorCode;

            return (customer != null && amount > customer.Balance) ? 3002 : errorCode;
        }

        [HttpPost]
        public async Task<IActionResult> EndRound([FromBody] EndGameCall request, [FromRoute] string @operator)
        {
            var selectedOperator = GetOperator(@operator);
            var result = new EndGameResult();
            var customer = selectedOperator.Customers.Find(x => x.PlayerId == request.PlayerId && x.SiteId == request.SiteId);
            var resultTemplate = selectedOperator.EndGameResult;

            var delayTime = customer?.Delay.EndGame > 0 ? customer.Delay.EndGame : resultTemplate.DelayTime;
            result.ErrorCode = customer?.ErrorCode.EndGame > 0 ? customer.ErrorCode.EndGame : resultTemplate.ErrorCode;
            result.Seq = request.Seq;

            if (result.ErrorCode == 0 && customer != null)
            {
                result.PlayerId = request.PlayerId;
                customer.Balance += request.TotalWin;
            }

            await Task.Delay(delayTime);

            return Ok(new OWResponse<EndGameResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> VoidRound([FromBody] VoidGameCall request, [FromRoute] string @operator)
        {
            var selectedOperator = GetOperator(@operator);
            var result = selectedOperator.VoidGameResult;
            result.Seq = request.Seq;
            if (result.ErrorCode == 0)
            {
                result.PlayerId = request.PlayerId;
            }

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<VoidGameResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> CheckMaintenance([FromBody] CheckMaintenanceCall request, [FromRoute] string @operator)
        {
            var selectedOperator = GetOperator(@operator);
            var result = selectedOperator.CheckMaintenanceResult;
            result.Seq = request.Seq;

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<CheckMaintenanceResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpGet]
        public IActionResult UpdateHitJackpotResult()
        {
            return View(serviceProvider.GetRequiredService<HitJackpotResult>());
        }

        [HttpPost]
        public async Task<IActionResult> HitJackpot([FromBody] HitJackpotCall request, [FromRoute] string @operator)
        {
            var selectedOperator = GetOperator(@operator);
            var customer = selectedOperator.Customers.FirstOrDefault(x => x.PlayerId == request.PlayerId && x.SiteId == request.SiteId);
            var result = selectedOperator.HitJackpotResult;

            result.Seq = request?.Seq;

            if (result.ErrorCode == 0 && customer != null)
            {
                result.PlayerId = request.PlayerId;
                customer.Balance += request.WinningAmount;
            }

            await Task.Delay(result.DelayTime);

            return Ok(new OWResponse<HitJackpotResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> GetBetLimit([FromBody] GetBetLimitCall request, [FromRoute] string @operator)
        {
            var selectedOperator = GetOperator(@operator);
            var result = new GetBetLimitResult();
            var customer = selectedOperator.Customers.FirstOrDefault(x => x.PlayerId == request.PlayerId && x.SiteId == request.SiteId);
            var resultTemplate = selectedOperator.GetBetLimitResult;
            result.Seq = request.Seq;

            var delayTime = customer?.Delay.GetBetLimit > 0 ? customer.Delay.GetBetLimit : resultTemplate.DelayTime;
            result.ErrorCode = customer?.ErrorCode.GetBetLimit > 0 ? customer.ErrorCode.GetBetLimit : resultTemplate.ErrorCode;

            if (result.ErrorCode == 0)
            {
                if (customer != null)
                {
                    result.MinBet = customer.MinBet;
                    result.MaxBet = customer.MaxBet;
                }
                else
                {
                    result.MinBet = result.MaxBet = 0;
                }
            }
            else
            {
                result.MinBet = result.MaxBet = 0;
            }

            await Task.Delay(delayTime);

            return Ok(new OWResponse<GetBetLimitResult>
            {
                TimeStamp = DateTimeOffset.UtcNow,
                Result = result
            });
        }

        [HttpGet]
        [Route("/[controller]/[action]")]
        public IActionResult UpdateOperator(string name)
        {
            var selectedOperator = GetOperator(name);

            return View(selectedOperator);
        }

        [HttpPost]
        [Route("/[controller]/[action]")]
        public IActionResult UpdateOperator(Operator model)
        {
            var selectedOperator = GetOperator(model.Name);
            selectedOperator.EnterPortalResult = model.EnterPortalResult;
            selectedOperator.GetBalanceResult = model.GetBalanceResult;
            selectedOperator.PlaceBetResult = model.PlaceBetResult;
            selectedOperator.EndGameResult = model.EndGameResult;
            selectedOperator.VoidGameResult = model.VoidGameResult;
            selectedOperator.CheckMaintenanceResult = model.CheckMaintenanceResult;
            selectedOperator.GetBetLimitResult = model.GetBetLimitResult;
            selectedOperator.HitJackpotResult = model.HitJackpotResult;

            return View(selectedOperator);
        }

        private Operator GetOperator(string operatorName)
        {
            return serviceProvider.GetRequiredService<List<Operator>>().FirstOrDefault(x => string.Compare(x.Name, operatorName, true) == 0);
        }

        [HttpGet]
        [Route("{username}")]
        public IActionResult GetMemberInfo([FromRoute] string username, [FromRoute] string @operator)
        {
            var selectedOperator = GetOperator(@operator);
            var result = new MemberInfoResult();
            var customer = selectedOperator.Customers.Find(x => string.Equals(x.Username, username, StringComparison.InvariantCultureIgnoreCase));

            result.ErrorCode = customer?.ErrorCode.MemberLogin ?? 0;

            if (result.ErrorCode == 0 && customer != null)
            {
                result.UserId = customer.PlayerId;
                result.Username = customer.Username;
                result.Currency = customer.Currency;
                result.SiteName = customer.SiteName;
            }

            return Ok(result);
        }
    }
}