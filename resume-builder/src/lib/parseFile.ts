import mammoth from "mammoth";

export async function parseResumeFile(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    // pdf-parse is CommonJS; import dynamically for Next bundlers
    const mod = (await import("pdf-parse")) as unknown as
      | ((data: Buffer) => Promise<{ text: string }>)
      | { default?: (data: Buffer) => Promise<{ text: string }> };
    const fn = typeof mod === "function" ? mod : mod.default;
    if (typeof fn !== "function") {
      throw new Error("PDF parser module shape unsupported");
    }
    const result = await fn(buf);
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

