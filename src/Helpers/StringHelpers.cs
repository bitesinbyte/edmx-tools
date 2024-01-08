using System.Text;

namespace EdmxTools.Helpers;

public static class StringHelpers
{
    public static string Base64Decode(string encodedString)
    {
        var bytes = Convert.FromBase64String(encodedString);
        return Encoding.UTF8.GetString(bytes);
    }
}