export function downloadFile(content: string, fileName: string, mimeType = "application/octet-stream") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const VALID_EXTENSIONS = [".edmx", ".xml", ".csdl"];

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File too large. Maximum size is 50 MB, your file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`;
  }

  const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  if (!VALID_EXTENSIONS.includes(ext)) {
    return `Invalid file type "${ext}". Please upload a .edmx, .xml, or .csdl file.`;
  }

  return null;
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file, "UTF-8");
  });
}
