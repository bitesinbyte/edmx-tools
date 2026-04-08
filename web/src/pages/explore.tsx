import { useState, useMemo, useCallback } from "react";
import { FileUpload } from "@/components/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getEntityAndEnumTypes, getEntityProperties } from "@/lib/edmx-helpers";
import { toast } from "sonner";
import type { EntityProperty } from "@/lib/types";

export default function ExplorePage() {
  const [xmlData, setXmlData] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [filter, setFilter] = useState("");

  const entitiesAndEnums = useMemo(() => {
    if (!xmlData) return [];
    try { return getEntityAndEnumTypes(xmlData); }
    catch (e) { toast.error(`Parse error: ${e instanceof Error ? e.message : "Unknown error"}`); return []; }
  }, [xmlData]);

  const entityNames = useMemo(() => entitiesAndEnums.map((e) => e.name), [entitiesAndEnums]);

  const { properties, isEnum } = useMemo(() => {
    if (!selectedEntity) return { properties: [] as EntityProperty[], isEnum: false };
    const found = entitiesAndEnums.find((e) => e.name === selectedEntity);
    if (!found) return { properties: [] as EntityProperty[], isEnum: false };
    return getEntityProperties(found.node, found.type);
  }, [selectedEntity, entitiesAndEnums]);

  const filteredProperties = useMemo(() => {
    if (!filter) return properties;
    const lc = filter.toLowerCase();
    return properties.filter((p) => p.name.toLowerCase().includes(lc) || p.type?.toLowerCase().includes(lc));
  }, [properties, filter]);

  const handleFileLoaded = useCallback((content: string) => {
    setXmlData(content);
    setSelectedEntity("");
    setFilter("");
  }, []);

  const handleEntityChange = (value: string | null) => {
    setSelectedEntity(value ?? "");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edmx Explorer</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse EntityTypes and EnumTypes in your EDMX file.</p>
      </div>

      <FileUpload onFileLoaded={handleFileLoaded} />

      {entityNames.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Select Entity or Enum</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={handleEntityChange} value={selectedEntity}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose an entity..." />
              </SelectTrigger>
              <SelectContent>
                {entityNames.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {properties.length > 0 && (
              <>
                <Input
                  placeholder="Filter properties..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="max-w-sm"
                />
                <div className="rounded-md border overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        {!isEnum && <TableHead>Type</TableHead>}
                        {!isEnum && <TableHead>Nullable</TableHead>}
                        {!isEnum && <TableHead>Key</TableHead>}
                        {isEnum && <TableHead>Value</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProperties.map((p) => (
                        <TableRow key={p.name}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          {!isEnum && <TableCell><code className="text-xs bg-muted px-1 py-0.5 rounded">{p.type ?? "-"}</code></TableCell>}
                          {!isEnum && <TableCell>{p.nullable ? <Badge variant="outline">Yes</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>}
                          {!isEnum && <TableCell>{p.key ? <Badge>Key</Badge> : "-"}</TableCell>}
                          {isEnum && <TableCell>{p.value ?? "-"}</TableCell>}
                        </TableRow>
                      ))}
                      {filteredProperties.length === 0 && (
                        <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No properties found</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-muted-foreground">{filteredProperties.length} of {properties.length} properties</p>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
