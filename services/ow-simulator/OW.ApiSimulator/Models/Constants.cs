using System.Collections.Generic;

namespace OW.ApiSimulator.Models
{
    public static class Constants
    {
        public static readonly string[] Operators = { "ow", "sbo", "ow_vg", "pff", "ONEworksSeal888", "sabaplay" };
        public static readonly Dictionary<string, string> ForcedToUseOWOperatorsMapper = new Dictionary<string, string>{{ "ow_vg", "ow"}, { "ONEworksSeal888", "ow" } };

        public static readonly Dictionary<string, string> OperatorIds = new Dictionary<string,string>
        {
            {"ow", "ONEworks1" },
            {"sbo", "ONEworksVGCash" }
        };

        public static readonly Dictionary<string, string> LoginLanguageMapper = new Dictionary<string, string>
        {
            {"en", "en-US" },
            {"vn", "vi-VN" },
            {"ch", "zh-TW" },
            {"cs", "zh-CN" },
            {"th", "th-TH" },
            {"id", "id-ID" },
        };
    }    
}