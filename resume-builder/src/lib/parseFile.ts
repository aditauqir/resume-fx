import mammoth from "mammoth";

export async function parseResumeFile(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    // pdf-parse is CommonJS; import dynamically for Next bundlers
    const mod = (await import("pdf-parse")) as unknown as {
      default: (data: Buffer) => Promise<{ text: string }>;
    };
    const result = await mod.default(buf);
    return result.text ?? "";
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

