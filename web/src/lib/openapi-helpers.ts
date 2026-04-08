import jsYaml from "js-yaml";
import { XMLParser } from "fast-xml-parser";

// Simple EDMX-to-OpenAPI converter that runs entirely in the browser.
// This converts the CSDL EntityTypes + EntitySets into basic OpenAPI 3.0 paths and schemas.

interface SchemaNode {
  "@_Namespace"?: string;
  EntityContainer?: Record<string, unknown>;
  EntityType?: EntityTypeNode[];
  EnumType?: EnumTypeNode[];
  [key: string]: unknown;
}

interface EntityTypeNode {
  "@_Name": string;
  Property?: PropertyNode[];
  Key?: { PropertyRef: { "@_Name": string }[] };
  [key: string]: unknown;
}

interface EnumTypeNode {
  "@_Name": string;
  Member?: { "@_Name": string; "@_Value"?: string }[];
}

interface PropertyNode {
  "@_Name": string;
  "@_Type"?: string;
  "@_Nullable"?: string;
}

interface EntitySetNode {
  "@_Name": string;
  "@_EntityType": string;
}

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (tagName: string) => {
    const arrayTags = [
      "EntitySet", "EntityType", "EnumType", "Property",
      "NavigationProperty", "PropertyRef", "Member", "Action",
    ];
    return arrayTags.includes(tagName);
  },
};

function findSchemas(obj: unknown): SchemaNode[] {
  const schemas: SchemaNode[] = [];
  function walk(node: unknown) {
    if (node && typeof node === "object") {
      const record = node as Record<string, unknown>;
      if ("Schema" in record) {
        const schema = record["Schema"];
        if (Array.isArray(schema)) schemas.push(...(schema as SchemaNode[]));
        else if (schema) schemas.push(schema as SchemaNode);
      }
      for (const val of Object.values(record)) walk(val);
    }
  }
  walk(obj);
  return schemas;
}

function edmTypeToJsonType(edmType?: string): { type: string; format?: string } {
  if (!edmType) return { type: "string" };
  const t = edmType.replace("Edm.", "").toLowerCase();
  switch (t) {
    case "int16": case "int32": return { type: "integer", format: "int32" };
    case "int64": return { type: "integer", format: "int64" };
    case "decimal": case "double": case "single": return { type: "number", format: "double" };
    case "boolean": return { type: "boolean" };
    case "datetimeoffset": return { type: "string", format: "date-time" };
    case "date": return { type: "string", format: "date" };
    case "guid": return { type: "string", format: "uuid" };
    case "binary": return { type: "string", format: "binary" };
    case "byte": return { type: "string", format: "byte" };
    default: return { type: "string" };
  }
}

export function convertToOpenApi(xml: string, format: "json" | "yaml"): string {
  const parser = new XMLParser(parserOptions);
  const parsed = parser.parse(xml);
  const schemas = findSchemas(parsed);

  const namespace = schemas.find((s) => s["@_Namespace"])?.["@_Namespace"] || "";
  const container = schemas.find((s) => s["EntityContainer"])?.["EntityContainer"] as Record<string, unknown> | undefined;
  const entitySets = (container?.["EntitySet"] as EntitySetNode[]) || [];

  // Build component schemas
  const componentSchemas: Record<string, unknown> = {};

  for (const schema of schemas) {
    for (const et of (schema["EntityType"] as EntityTypeNode[]) || []) {
      const properties: Record<string, unknown> = {};
      const required: string[] = [];

      for (const prop of et["Property"] || []) {
        const propSchema = edmTypeToJsonType(prop["@_Type"]);
        properties[prop["@_Name"]] = propSchema;
        if (prop["@_Nullable"] === "false") {
          required.push(prop["@_Name"]);
        }
      }

      componentSchemas[et["@_Name"]] = {
        type: "object",
        properties,
        ...(required.length > 0 ? { required } : {}),
      };
    }

    for (const en of (schema["EnumType"] as EnumTypeNode[]) || []) {
      const enumValues = (en["Member"] || []).map((m) => m["@_Name"]);
      componentSchemas[en["@_Name"]] = {
        type: "string",
        enum: enumValues,
      };
    }
  }

  // Build paths from EntitySets
  const paths: Record<string, unknown> = {};

  for (const es of entitySets) {
    const typeName = es["@_EntityType"].replace(`${namespace}.`, "");
    const path = `/${es["@_Name"]}`;

    paths[path] = {
      get: {
        summary: `Get list of ${es["@_Name"]}`,
        operationId: `list${typeName}`,
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    value: {
                      type: "array",
                      items: { $ref: `#/components/schemas/${typeName}` },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  const openApiDoc = {
    openapi: "3.0.3",
    info: {
      title: "OData Service",
      version: "1.0.0",
      description: "OpenAPI specification generated from EDMX metadata",
    },
    paths,
    components: {
      schemas: componentSchemas,
    },
  };

  if (format === "yaml") {
    return jsYaml.dump(openApiDoc, { indent: 2, lineWidth: -1 });
  }
  return JSON.stringify(openApiDoc, null, 2);
}
