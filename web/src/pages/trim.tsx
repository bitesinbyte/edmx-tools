import { useState, useMemo, useCallback } from "react";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllEntities, trimEdmx } from "@/lib/edmx-helpers";
import { downloadFile } from "@/lib/file-utils";
import { toast } from "sonner";
import { X, Download, Scissors } from "lucide-react";

export default function TrimPage() {
  const [xmlData, setXmlData] = useState<string | null>(null);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [excludeSelected, setExcludeSelected] = useState(false);
  const [trimmedData, setTrimmedData] = useState<string | null>(null);

  const allEntities = useMemo(() => {
    if (!xmlData) return [];
    try { return getAllEntities(xmlData); }
    catch (e) { toast.error(`Parse error: ${e instanceof Error ? e.message : "Unknown error"}`); return []; }
  }, [xmlData]);

  const availableEntities = useMemo(
    () => allEntities.filter((e) => !selectedEntities.includes(e)).sort(),
    [allEntities, selectedEntities]
  );

  const handleFileLoaded = useCallback((content: string) => {
    setXmlData(content);
    setSelectedEntities([]);
    setTrimmedData(null);
  }, []);

  const handleSelectEntity = (value: string | null) => {
    if (value && !selectedEntities.includes(value)) {
      setSelectedEntities((prev) => [...prev, value]);
    }
  };

  const handleRemoveEntity = (entity: string) => {
    setSelectedEntities((prev) => prev.filter((e) => e !== entity));
  };

  const handleTrim = () => {
    if (!xmlData || selectedEntities.length === 0) {
      toast.warning("Please select at least one entity.");
      return;
    }
    try {
      const result = trimEdmx(xmlData, selectedEntities, excludeSelected);
      setTrimmedData(result);
      toast.success("EDMX trimmed successfully!");
    } catch (e) {
      toast.error(`Trim failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  };

  const handleDownload = () => {
    if (trimmedData) {
      downloadFile(trimmedData, "trimmedMetadata.xml", "application/xml");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edmx Trimmer</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload an EDMX file and select entities to keep or exclude.</p>
      </div>

      <FileUpload onFileLoaded={handleFileLoaded} />

      {allEntities.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Select Entities</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={handleSelectEntity} value="">
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose an entity..." />
              </SelectTrigger>
              <SelectContent>
                {availableEntities.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedEntities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedEntities.map((e) => (
                  <Badge key={e} variant="secondary" className="gap-1 pr-1">
                    {e}
                    <button onClick={() => handleRemoveEntity(e)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="exclude"
                  checked={excludeSelected}
                  onCheckedChange={(checked) => setExcludeSelected(checked)}
                />
                <Label htmlFor="exclude">Exclude Selected</Label>
              </div>
              <Button onClick={handleTrim} disabled={selectedEntities.length === 0}>
                <Scissors className="h-4 w-4 mr-2" /> Trim
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {trimmedData && (
        <Card>
          <CardContent className="py-4">
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" /> Download Trimmed File
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
