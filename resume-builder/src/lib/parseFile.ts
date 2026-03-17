import mammoth from "mammoth";

export async function parseResumeFile(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    // In this dev environment, reliable PDF parsing is not available.
    // For now, only DOCX is supported to keep the app stable.
    throw new Error(
      "PDF parsing is not available in this development environment. Please upload a DOCX file instead.",
    );
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

