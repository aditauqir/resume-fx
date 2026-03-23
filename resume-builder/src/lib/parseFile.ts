import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export async function parseResumeFile(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const parser = new PDFParse({ data: buf });
    try {
      const result = await parser.getText();
      return result.text ?? "";
    } finally {
      await parser.destroy?.();
    }
  }

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer: buf });
    return result.value ?? "";
  }

  throw new Error("Unsupported file type");
}

