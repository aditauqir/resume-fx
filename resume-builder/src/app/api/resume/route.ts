import { NextResponse } from "next/server";
import { getSupabaseServerClient, getSupabaseServiceRoleClient } from "@/lib/supabase";
import { parseResumeFile } from "@/lib/parseFile";
import { buildPrompt } from "@/lib/prompt";
import { callAI } from "@/lib/aiClient";
import type { Provider } from "@/lib/validateKey";

export const runtime = "nodejs";

function normalizeLatex(output: string) {
  const trimmed = output.trim().replace(/^\uFEFF/, "");
  const fenceMatch = trimmed.match(/^```(?:latex)?\s*([\s\S]*?)\s*```$/i);
  const withoutFences = fenceMatch ? fenceMatch[1] : trimmed;
  const start = withoutFences.indexOf("\\documentclass");
  if (start >= 0) return withoutFences.slice(start).trim();
  return withoutFences.trim();
}

async function getUploadsLeft(userId: string) {
  const service = getSupabaseServiceRoleClient();
  const { data, error } = await service
    .from("profiles")
    .select("uploads_left")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error("Could not load upload credits");
  return Number(data?.uploads_left ?? 10);
}

async function consumeUploadCredit(userId: string) {
  const service = getSupabaseServiceRoleClient();
  const current = await getUploadsLeft(userId);
  if (current <= 0) return { ok: false as const, uploadsLeft: 0 };

  const next = current - 1;
  const { data, error } = await service
    .from("profiles")
    .update({ uploads_left: next, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .eq("uploads_left", current)
    .select("uploads_left")
    .single();

  if (!error && data) {
    return { ok: true as const, uploadsLeft: Number(data.uploads_left ?? next) };
  }

  // Retry once if another request changed the row between read and write.
  const latest = await getUploadsLeft(userId);
  if (latest <= 0) return { ok: false as const, uploadsLeft: 0 };

  const retryNext = latest - 1;
  const retry = await service
    .from("profiles")
    .update({ uploads_left: retryNext, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .eq("uploads_left", latest)
    .select("uploads_left")
    .single();

  if (retry.error || !retry.data) {
    throw new Error("Could not decrement upload credits");
  }

  return {
    ok: true as const,
    uploadsLeft: Number(retry.data.uploads_left ?? retryNext),
  };
}

export async function POST(req: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminEmail = process.env.ADMIN_LOGIN_EMAIL ?? process.env.ADMIN_EMAIL;
  const isAdmin = user.email === adminEmail;
  let uploadsLeft = Number.MAX_SAFE_INTEGER;
  if (!isAdmin) {
    uploadsLeft = await getUploadsLeft(user.id);
    if (uploadsLeft <= 0) {
      return NextResponse.json(
        { error: "No uploads left", uploadsLeft: 0 },
        { status: 429 },
      );
    }
  }

  const form = await req.formData();
  // Next/Node may type `req.formData()` with a FormData shape that doesn't include `.get`.
  const formAny = form as any;
  const file = formAny.get?.("file");
  const outputFormat = String(formAny.get?.("outputFormat") ?? "pdf");
  const provider = String(formAny.get?.("provider") ?? "") as Provider;
  const apiKey = String(formAny.get?.("apiKey") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (!["pdf", "latex", "hybrid"].includes(outputFormat)) {
    return NextResponse.json({ error: "Invalid outputFormat" }, { status: 400 });
  }
  if (!["claude", "openai", "gemini", "ollama"].includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }
  if (provider !== "ollama" && !apiKey.trim()) {
    return NextResponse.json({ error: "Missing apiKey" }, { status: 400 });
  }

  const resumeText = await parseResumeFile(file);
  if (!resumeText.trim()) {
    return NextResponse.json({ error: "Could not extract text from file" }, { status: 400 });
  }

  const service = getSupabaseServiceRoleClient();

  const { data: promptRows, error: promptsError } = await service
    .from("admin_prompts")
    .select("prompt_text, step_order, is_active")
    .eq("is_active", true)
    .order("step_order", { ascending: true });
  if (promptsError) {
    return NextResponse.json({ error: "Could not load prompts" }, { status: 500 });
  }

  const { data: templateRow, error: templateError } = await service
    .from("admin_template")
    .select("latex_code")
    .eq("id", 1)
    .maybeSingle();
  if (templateError) {
    return NextResponse.json({ error: "Could not load template" }, { status: 500 });
  }

  const { data: keywordRow, error: keywordsError } = await service
    .from("admin_keywords")
    .select("keywords")
    .eq("id", 1)
    .maybeSingle();
  if (keywordsError) {
    return NextResponse.json({ error: "Could not load keywords" }, { status: 500 });
  }

  const steps = (promptRows ?? [])
    .map((r) => String((r as { prompt_text?: unknown }).prompt_text ?? ""))
    .filter(Boolean);
  const latexTemplate = String(templateRow?.latex_code ?? "");
  const keywords = String(keywordRow?.keywords ?? "")
    .split(/[,;\n]+/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const prompt = buildPrompt(
    resumeText,
    steps.length
      ? steps
      : ["Make this resume as strong, concise, and impactful as possible using the provided LaTeX template, matching its sections and formatting."],
    latexTemplate,
    keywords,
  );
  const latex = normalizeLatex(await callAI(provider, apiKey, prompt));

  if (outputFormat === "latex") {
    if (!isAdmin) {
      const credit = await consumeUploadCredit(user.id);
      if (!credit.ok) {
        return NextResponse.json(
          { error: "No uploads left", uploadsLeft: credit.uploadsLeft },
          { status: 429 },
        );
      }
      uploadsLeft = credit.uploadsLeft;
    }
    await service.from("usage_logs").insert({ user_id: user.id });
    return new NextResponse(latex, {
      headers: {
        "content-type": "application/x-tex; charset=utf-8",
        "content-disposition": `attachment; filename="resume.tex"`,
        "x-uploads-left": String(uploadsLeft),
      },
    });
  }

  const compileRes = await fetch("https://latexonline.cc/compile", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `code=${encodeURIComponent(latex)}`,
  });

  if (!compileRes.ok) {
    const t = await compileRes.text().catch(() => "");
    return NextResponse.json(
      { error: "LaTeX compilation failed", detail: t.slice(0, 2000), latex },
      { status: 500 },
    );
  }

  const pdf = await compileRes.arrayBuffer();
  if (!isAdmin) {
    const credit = await consumeUploadCredit(user.id);
    if (!credit.ok) {
      return NextResponse.json(
        { error: "No uploads left", uploadsLeft: credit.uploadsLeft },
        { status: 429 },
      );
    }
    uploadsLeft = credit.uploadsLeft;
  }
  await service.from("usage_logs").insert({ user_id: user.id });

  if (outputFormat === "hybrid") {
    return NextResponse.json({
      latex,
      pdfBase64: Buffer.from(pdf).toString("base64"),
      mime: "application/pdf",
      filename: "resume.pdf",
      uploadsLeft: isAdmin ? undefined : uploadsLeft,
    });
  }

  return new NextResponse(pdf, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="resume.pdf"`,
    },
  });
}

