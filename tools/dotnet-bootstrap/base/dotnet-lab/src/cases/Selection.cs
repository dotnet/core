
using static System.IO.File;
using static System.IO.Path;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace Lab
{
    // The override testcases 
    public class Selection
    {
        internal static string DEFAULT_SELECTION_FILENAME = Combine(Program._Path, "selections.json");

        public static JObject List = JsonConvert.DeserializeObject<JObject>(ReadAllText(DEFAULT_SELECTION_FILENAME));

        // aww, why not?
        // public static object this[int i]
        // {
        //     get { return _selections[i]; }
        //     set { _selections[i] = value; }
        // }


    }
}