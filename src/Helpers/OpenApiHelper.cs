using System.Xml;
using System.Xml.Linq;
using Microsoft.OData.Edm;
using Microsoft.OData.Edm.Csdl;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Extensions;
using Microsoft.OpenApi.OData;

namespace EdmxTools;

public static class OpenApiHelper
{
    public static string Convert(string xml, OpenApiFormat openApiFormat)
    {
        var settings = new OpenApiConvertSettings
        {
            OpenApiSpecVersion = OpenApiSpecVersion.OpenApi3_0
        };
        return Generate(xml, openApiFormat, settings);
    }
    private static string Generate(string input, OpenApiFormat format, OpenApiConvertSettings settings)
    {
        var edmModel = GetEdmModel(input);
        var document = edmModel.ConvertToOpenApi(settings);
        return document.Serialize(settings.OpenApiSpecVersion, format);
    }
    private static IEdmModel GetEdmModel(string input)
    {
        var parsed = XElement.Parse(input);
        using XmlReader mainReader = parsed.CreateReader();
        return CsdlReader.Parse(mainReader, u =>
        {
            var referenceParsed = XElement.Parse(input);
            var referenceReader = referenceParsed.CreateReader();
            return referenceReader;
        });
    }
}
