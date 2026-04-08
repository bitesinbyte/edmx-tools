import { useCallback, useState, useRef } from "react";
import { Upload, FileCheck } from "lucide-react";
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
        toast.success(
          `"${file.name}" uploaded successfully (${(file.size / 1024).toFixed(0)} KB)`
        );
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
    <div
      className={cn(
        "rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer",
        "flex flex-col items-center justify-center gap-3",
        isDragging
          ? "border-foreground/30 bg-muted/50 scale-[1.01]"
          : "border-border/50 hover:border-foreground/20 hover:bg-muted/30"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      {fileName ? (
        <>
          <div className="rounded-lg bg-muted p-2.5">
            <FileCheck className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-sm font-medium">{fileName}</p>
          <p className="text-xs text-muted-foreground">
            Click or drag to replace
          </p>
        </>
      ) : (
        <>
          <div className="rounded-lg bg-muted p-2.5">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">
            Drop your EDMX file here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports .edmx, .xml, .csdl (max 50 MB)
          </p>
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
    </div>
  );
}
