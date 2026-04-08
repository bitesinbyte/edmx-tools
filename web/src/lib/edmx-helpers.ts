import { XMLParser, XMLBuilder } from "fast-xml-parser";
import type { EntityProperty } from "./types";

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (tagName: string) => {
    const arrayTags = [
      "EntitySet",
      "EntityType",
      "EnumType",
      "Property",
      "NavigationProperty",
      "PropertyRef",
      "Member",
      "Action",
      "ActionImport",
      "FunctionImport",
      "Function",
      "Singleton",
    ];
    return arrayTags.includes(tagName);
  },
};

const builderOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  suppressEmptyNode: false,
};

function parseXml(metadata: string) {
  const parser = new XMLParser(parserOptions);
  return parser.parse(metadata);
}

function findSchemas(obj: Record<string, unknown>): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [];

  function walk(node: unknown) {
    if (node && typeof node === "object") {
      const record = node as Record<string, unknown>;
      if ("Schema" in record) {
        const schema = record["Schema"];
        if (Array.isArray(schema)) {
          schemas.push(...(schema as Record<string, unknown>[]));
        } else if (schema) {
          schemas.push(schema as Record<string, unknown>);
        }
      }
      for (const val of Object.values(record)) {
        walk(val);
      }
    }
  }

  walk(obj);
  return schemas;
}

function findEntityContainer(
  schemas: Record<string, unknown>[]
): Record<string, unknown> | null {
  for (const schema of schemas) {
    if (schema["EntityContainer"]) {
      return schema["EntityContainer"] as Record<string, unknown>;
    }
  }
  return null;
}

interface EntitySetItem {
  "@_Name": string;
  "@_EntityType": string;
  NavigationProperty?: unknown[];
  [key: string]: unknown;
}

interface EntityTypeItem {
  "@_Name": string;
  Property?: PropertyItem[];
  NavigationProperty?: NavPropItem[];
  Key?: { PropertyRef: { "@_Name": string }[] };
  Member?: MemberItem[];
  [key: string]: unknown;
}

interface PropertyItem {
  "@_Name": string;
  "@_Type"?: string;
  "@_Nullable"?: string;
  [key: string]: unknown;
}

interface NavPropItem {
  "@_Type": string;
  [key: string]: unknown;
}

interface MemberItem {
  "@_Name": string;
  "@_Value"?: string;
  [key: string]: unknown;
}

interface ActionItem {
  "@_Name": string;
  [key: string]: unknown;
}

export function getAllEntities(metadata: string): string[] {
  const parsed = parseXml(metadata);
  const schemas = findSchemas(parsed);
  const container = findEntityContainer(schemas);
  if (!container) return [];

  const entitySets = (container["EntitySet"] as EntitySetItem[]) || [];
  return entitySets.map((es) => es["@_Name"]).filter(Boolean);
}

export function trimEdmx(
  metadata: string,
  entitiesSelected: string[],
  excludeSelected: boolean
): string {
  const parsed = parseXml(metadata);
  const schemas = findSchemas(parsed);
  const container = findEntityContainer(schemas);
  if (!container) return metadata;

  // Find namespace
  const schemaWithTypes = schemas.find((s) => s["@_Namespace"]);
  const entityNamespace = schemaWithTypes
    ? `${schemaWithTypes["@_Namespace"]}.`
    : "";

  const entitySets = (container["EntitySet"] as EntitySetItem[]) || [];

  // Determine which entities to keep
  const entitiesToKeep = excludeSelected
    ? entitySets.filter((es) => !entitiesSelected.includes(es["@_Name"]))
    : entitySets.filter((es) => entitiesSelected.includes(es["@_Name"]));

  const entityTypesFound = entitiesToKeep.map((es) =>
    es["@_EntityType"].replace(entityNamespace, "")
  );

  // Keep only selected EntitySets
  container["EntitySet"] = entitiesToKeep;

  // Remove NavigationProperty from EntitySets
  for (const es of entitiesToKeep) {
    delete es["NavigationProperty"];
  }

  // Process each schema
  for (const schema of schemas) {
    // Filter EntityTypes
    const entityTypes =
      (schema["EntityType"] as EntityTypeItem[]) || [];
    schema["EntityType"] = entityTypes.filter((et) =>
      entityTypesFound.includes(et["@_Name"])
    );

    // Remove orphaned NavigationProperties from kept EntityTypes
    for (const et of schema["EntityType"] as EntityTypeItem[]) {
      if (et["NavigationProperty"]) {
        et["NavigationProperty"] = et["NavigationProperty"].filter(
          (np: NavPropItem) =>
            entityTypesFound.some((name) => np["@_Type"].includes(name))
        );
        if (et["NavigationProperty"].length === 0) {
          delete et["NavigationProperty"];
        }
      }
    }

    // Remove all Actions
    delete schema["Action"];
    const actions = schema["Action"] as ActionItem[] | undefined;
    if (actions) {
      delete schema["Action"];
    }
  }

  const builder = new XMLBuilder(builderOptions);
  return builder.build(parsed) as string;
}

export function getEntityAndEnumTypes(
  metadata: string
): { name: string; type: "entity" | "enum"; node: EntityTypeItem }[] {
  const parsed = parseXml(metadata);
  const schemas = findSchemas(parsed);
  const result: {
    name: string;
    type: "entity" | "enum";
    node: EntityTypeItem;
  }[] = [];

  for (const schema of schemas) {
    const entityTypes =
      (schema["EntityType"] as EntityTypeItem[]) || [];
    for (const et of entityTypes) {
      result.push({ name: et["@_Name"], type: "entity", node: et });
    }

    const enumTypes =
      (schema["EnumType"] as EntityTypeItem[]) || [];
    for (const en of enumTypes) {
      result.push({ name: en["@_Name"], type: "enum", node: en });
    }
  }

  return result;
}

export function getEntityProperties(
  node: EntityTypeItem,
  nodeType: "entity" | "enum"
): { properties: EntityProperty[]; isEnum: boolean } {
  const isEnum = nodeType === "enum";

  if (isEnum) {
    const members = (node["Member"] as MemberItem[]) || [];
    const properties: EntityProperty[] = members.map((m) => ({
      name: m["@_Name"],
      nullable: false,
      key: false,
      value: m["@_Value"],
    }));
    return { properties, isEnum: true };
  }

  const props = (node["Property"] as PropertyItem[]) || [];
  const keyRefs =
    node["Key"]?.["PropertyRef"]?.map((pr) => pr["@_Name"]) || [];

  const properties: EntityProperty[] = props.map((p) => ({
    name: p["@_Name"],
    type: p["@_Type"],
    nullable: p["@_Nullable"] !== "false",
    key: keyRefs.includes(p["@_Name"]),
  }));

  return { properties, isEnum: false };
}
