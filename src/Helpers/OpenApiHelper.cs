using System.Xml.Linq;
using Microsoft.OData.Edm.Csdl;
using Microsoft.OpenApi;
using Microsoft.OpenApi.OData;

namespace EdmxTools.Helpers;

public static class OpenApiHelper
{
    public static async Task<string> ConvertAsync(string xml, bool asYaml)
    {
        var settings = new OpenApiConvertSettings
        {
            OpenApiSpecVersion = OpenApiSpecVersion.OpenApi3_0
        };

        var edmModel = GetEdmModel(xml);
        var document = edmModel.ConvertToOpenApi(settings);

        return asYaml
            ? await document.SerializeAsYamlAsync(OpenApiSpecVersion.OpenApi3_0)
            : await document.SerializeAsJsonAsync(OpenApiSpecVersion.OpenApi3_0);
    }

    private static Microsoft.OData.Edm.IEdmModel GetEdmModel(string input)
    {
        var parsed = XElement.Parse(input);
        using var mainReader = parsed.CreateReader();
        return CsdlReader.Parse(mainReader, _ =>
        {
            var referenceParsed = XElement.Parse(input);
            return referenceParsed.CreateReader();
        });
    }
}
