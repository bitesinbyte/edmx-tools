using System.Xml;

namespace EdmxTools.Helpers;
public static class XmlHelpers
{
    private const string ENTITY_SET = "EntitySet";
    private const string ENTITY_TYPE = "EntityType";
    private const string ENUM_TYPE = "EnumType";
    private const string ATTRIBUTE_NAME = "Name";
    private const string NAVIGATION_PROPERTY = "NavigationProperty";
    private const string ACTION = "Action";
    private const string ATTRIBUTE_TYPE = "Type";
    private const string ATTRIBUTE_NAMESPACE = "Namespace";
    private const string TAG_SCHEMA = "Schema";
    public static List<string> GetAllEntities(string metadata)
    {
        var xmlDocument = new XmlDocument();
        xmlDocument.LoadXml(metadata);

        var nodes = xmlDocument.GetElementsByTagName(ENTITY_SET).Cast<XmlNode>();
        var entities = nodes.Select(n => n.Attributes[ATTRIBUTE_NAME].Value).ToList();
        return entities;
    }
    public static string Trim(string metadata, List<string> entitiesSelected, bool excludeSelected)
    {
        var trimmedData = string.Empty;
        var xmlDocument = new XmlDocument();
        xmlDocument.LoadXml(metadata);

        var entityNamespace = xmlDocument.GetElementsByTagName(TAG_SCHEMA)[0].Attributes[ATTRIBUTE_NAMESPACE].Value + ".";

        var entitySets = xmlDocument.GetElementsByTagName(ENTITY_SET).Cast<XmlNode>().ToList();
        var entityTypes = xmlDocument.GetElementsByTagName(ENTITY_TYPE).Cast<XmlNode>().ToList();
        var entityActions = xmlDocument.GetElementsByTagName(ACTION).Cast<XmlNode>().ToList();

        var entityTypesFound = new List<string>();

        var entitiesKeep = entitySets.Where(n => entitiesSelected.Contains(n.Attributes[ATTRIBUTE_NAME].Value)).ToList();
        entitiesKeep.ForEach(n =>
        {
            string entityType = n.Attributes[ENTITY_TYPE].Value;
            entityType = entityType.Replace(entityNamespace, "");
            entityTypesFound.Add(entityType);
        });

        // Remove entities not required (EntitySet)
        entitySets.Except(entitiesKeep).ToList().ForEach(n => n.ParentNode.RemoveChild(n));

        //Remove unwanted Nodes in the Entity Set
        entitiesKeep.ForEach(n =>
        {
            // Remove Node NavigationProperty
            var navProperties = n.ChildNodes.Cast<XmlNode>()
                .Where(navProp => navProp.Name.Equals(NAVIGATION_PROPERTY)).ToList();
            navProperties
                .ForEach(navProp => navProp.ParentNode.RemoveChild(navProp));
        });

        // Remove all navigation properties

        xmlDocument.GetElementsByTagName(NAVIGATION_PROPERTY).Cast<XmlNode>().Where(navProp => !entityTypesFound.Any(s => navProp.Attributes[ATTRIBUTE_TYPE].Value.Contains(s))).ToList()
            .ForEach(n => n.ParentNode.RemoveChild(n));

        // Remove entity not required (EntityType)
        var entityTypesKeep = entityTypes.Where(n => entityTypesFound.Contains(n.Attributes[ATTRIBUTE_NAME].Value)).ToList();
        entityTypes.Except(entityTypesKeep).ToList().ForEach(n => n.ParentNode.RemoveChild(n));

        // Remove all Actions
        entityActions.ForEach(n => n.ParentNode.RemoveChild(n));
        return xmlDocument.OuterXml;
    }
    public static List<XmlNode> GetEntityAndEnumTypes(string metadata)
    {
        var xmlDocument = new XmlDocument();
        xmlDocument.LoadXml(metadata);
        var entityType = xmlDocument.GetElementsByTagName(ENTITY_TYPE).Cast<XmlNode>().ToList();
        var enumType = xmlDocument.GetElementsByTagName(ENUM_TYPE).Cast<XmlNode>();
        entityType.AddRange(enumType);
        return entityType;
    }
}