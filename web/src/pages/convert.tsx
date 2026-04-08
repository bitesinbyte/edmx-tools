import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { convertToOpenApi } from "@/lib/openapi-helpers";
import { downloadFile } from "@/lib/file-utils";
import { toast } from "sonner";
import { Download, RefreshCw } from "lucide-react";

export default function ConvertPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "open-api-json";
  const [xmlData, setXmlData] = useState<string | null>(null);
  const [convertedValue, setConvertedValue] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const formatLabel = useMemo(() => (type === "open-api-yml" ? "OpenAPI YAML" : "OpenAPI JSON"), [type]);

  const handleFileLoaded = useCallback((content: string) => {
    setXmlData(content);
    setConvertedValue(null);
  }, []);

  const handleConvert = () => {
    if (!xmlData) {
      toast.warning("Please upload an EDMX file first.");
      return;
    }
    try {
      setIsConverting(true);
      const format = type === "open-api-yml" ? "yaml" : "json";
      const result = convertToOpenApi(xmlData, format as "json" | "yaml");
      setConvertedValue(result);
      toast.success(`Converted to ${formatLabel} successfully!`);
    } catch (e) {
      toast.error(`Conversion failed: ${e instanceof Error ? e.message : "Unknown error"}`);
      setConvertedValue(null);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedValue) return;
    const ext = type === "open-api-yml" ? ".yml" : ".json";
    const mime = type === "open-api-yml" ? "text/yaml" : "application/json";
    downloadFile(convertedValue, `openapi${ext}`, mime);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Convert to {formatLabel}</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">Upload an EDMX file and convert it to {formatLabel} format.</p>
      </div>

      <FileUpload onFileLoaded={handleFileLoaded} />

      <div className="flex gap-3">
        <Button onClick={handleConvert} disabled={!xmlData || isConverting}>
          {isConverting ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Converting...</> : <>Convert to {formatLabel}</>}
        </Button>
        <Button variant="outline" onClick={handleDownload} disabled={!convertedValue}>
          <Download className="h-4 w-4 mr-2" /> Download
        </Button>
      </div>

      {convertedValue && (
        <div className="rounded-xl border bg-card p-6">
          <pre className="text-xs overflow-auto max-h-96 bg-muted/50 p-4 rounded-lg font-mono"><code>{convertedValue}</code></pre>
        </div>
      )}
    </div>
  );
}
