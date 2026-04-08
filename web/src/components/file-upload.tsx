import { useCallback, useState, useRef } from "react";
import { Upload, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { validateFile, readFileAsText } from "@/lib/file-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileLoaded: (content: string, fileName: string) => void;
}

export function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      try {
        const content = await readFileAsText(file);
        setFileName(file.name);
        onFileLoaded(content, file.name);
        toast.success(`"${file.name}" uploaded successfully (${(file.size / 1024).toFixed(0)} KB)`);
      } catch {
        toast.error("Failed to read file");
      }
    },
    [onFileLoaded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-colors cursor-pointer",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
        {fileName ? (
          <>
            <FileCheck className="h-8 w-8 text-green-500" />
            <p className="text-sm font-medium">{fileName}</p>
            <p className="text-xs text-muted-foreground">Click or drag to replace</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drop your EDMX file here or click to browse</p>
            <p className="text-xs text-muted-foreground">Supports .edmx, .xml, .csdl (max 50 MB)</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".edmx,.xml,.csdl"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </CardContent>
    </Card>
  );
}
