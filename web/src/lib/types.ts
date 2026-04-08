export interface EntityProperty {
  name: string;
  type?: string;
  nullable: boolean;
  key: boolean;
  value?: string;
}

export interface ParsedEntity {
  name: string;
  entityType: string;
}
