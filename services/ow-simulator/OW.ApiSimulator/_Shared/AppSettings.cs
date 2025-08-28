using System;
using System.ComponentModel;
using Microsoft.Extensions.Configuration;

namespace OW.ApiSimulator._Shared
{
    public interface IAppSettings
    {
        string SystemType { get; }

        string ApiUrl { get; }
    }

    public class AppSettings : IAppSettings
    {
        private readonly IConfiguration configuration;

        public AppSettings(IConfiguration configuration)
        {
            this.configuration = configuration;

            SystemType = GetValue<string>(nameof(SystemType));
            ApiUrl = GetValue<string>(nameof(ApiUrl));
        }

        public string SystemType { get; }

        public string ApiUrl { get; }

        public T GetValue<T>(string key)
        {
            try
            {
                var value = configuration[key];

                TypeConverter typeConverter = TypeDescriptor.GetConverter(typeof(T));

                return (T)typeConverter.ConvertFromString(value);
            }
            catch (Exception ex)
            {
                throw new InvalidCastException($"Key: {key}", ex);
            }
        }
    }
}