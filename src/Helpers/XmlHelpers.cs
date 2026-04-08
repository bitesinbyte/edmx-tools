using System.Xml;

namespace EdmxTools.Helpers;

public static class XmlHelpers
{
    private const string EntitySet = "EntitySet";
    private const string EntityType = "EntityType";
    private const string EnumType = "EnumType";
    private const string AttributeName = "Name";
    private const string NavigationProperty = "NavigationProperty";
    private const string Action = "Action";
    private const string AttributeType = "Type";
    private const string AttributeNamespace = "Namespace";
    private const string TagSchema = "Schema";

    public static List<string> GetAllEntities(string metadata)
    {
        var xmlDocument = new XmlDocument();
        xmlDocument.LoadXml(metadata);

        return xmlDocument
            .GetElementsByTagName(EntitySet)
            .Cast<XmlNode>()
            .Select(n => n.Attributes![AttributeName]!.Value)
            .ToList();
    }

    public static string Trim(string metadata, List<string> entitiesSelected, bool excludeSelected)
    {
        var xmlDocument = new XmlDocument();
        xmlDocument.LoadXml(metadata);

        var entityNamespace = xmlDocument
            .GetElementsByTagName(TagSchema)[0]!
            .Attributes![AttributeNamespace]!.Value + ".";

        var entitySets = xmlDocument.GetElementsByTagName(EntitySet).Cast<XmlNode>().ToList();
        var entityTypes = xmlDocument.GetElementsByTagName(EntityType).Cast<XmlNode>().ToList();
        var entityActions = xmlDocument.GetElementsByTagName(Action).Cast<XmlNode>().ToList();

        // When excludeSelected is true, keep entities NOT in the selection list
        // When excludeSelected is false, keep entities IN the selection list
        var entitiesKeep = excludeSelected
            ? entitySets.Where(n => !entitiesSelected.Contains(n.Attributes![AttributeName]!.Value)).ToList()
            : entitySets.Where(n => entitiesSelected.Contains(n.Attributes![AttributeName]!.Value)).ToList();

        var entityTypesFound = entitiesKeep
            .Select(n => n.Attributes![AttributeType]!.Value.Replace(entityNamespace, ""))
            .ToList();

        // Remove entities not required (EntitySet)
        foreach (var node in entitySets.Except(entitiesKeep))
        {
            node.ParentNode?.RemoveChild(node);
        }

        // Remove NavigationProperty nodes from kept EntitySets
        foreach (var node in entitiesKeep)
        {
            var navProperties = node.ChildNodes
                .Cast<XmlNode>()
                .Where(navProp => navProp.Name.Equals(NavigationProperty, StringComparison.Ordinal))
                .ToList();

            foreach (var navProp in navProperties)
            {
                navProp.ParentNode?.RemoveChild(navProp);
            }
        }

        // Remove orphaned navigation properties (those referencing removed entity types)
        var orphanedNavProps = xmlDocument
            .GetElementsByTagName(NavigationProperty)
            .Cast<XmlNode>()
            .Where(navProp => !entityTypesFound.Any(s =>
                navProp.Attributes![AttributeType]!.Value.Contains(s, StringComparison.Ordinal)))
            .ToList();

        foreach (var node in orphanedNavProps)
        {
            node.ParentNode?.RemoveChild(node);
        }

        // Remove entity types not required
        var entityTypesKeep = entityTypes
            .Where(n => entityTypesFound.Contains(n.Attributes![AttributeName]!.Value))
            .ToList();

        foreach (var node in entityTypes.Except(entityTypesKeep))
        {
            node.ParentNode?.RemoveChild(node);
        }

        // Remove all Actions
        foreach (var node in entityActions)
        {
            node.ParentNode?.RemoveChild(node);
        }

        return xmlDocument.OuterXml;
    }

    public static List<XmlNode> GetEntityAndEnumTypes(string metadata)
    {
        var xmlDocument = new XmlDocument();
        xmlDocument.LoadXml(metadata);

        var entityTypes = xmlDocument.GetElementsByTagName(EntityType).Cast<XmlNode>().ToList();
        var enumTypes = xmlDocument.GetElementsByTagName(EnumType).Cast<XmlNode>();
        entityTypes.AddRange(enumTypes);

        return entityTypes;
    }
}
