using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using OW.ApiSimulator.Models;

namespace OW.ApiSimulator.Extensions
{
    public static class SimulatorExtensions
    {
        public static void AddOW(this IServiceCollection services)
        {
            var operators = Constants.Operators.Select(x => new Operator(x));
            services.AddSingleton(operators.ToList());
        }
    }
}
