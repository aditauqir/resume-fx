"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion-web";
import { OutputSelector, type OutputFormat } from "@/components/OutputSelector";
import { ProviderSelector } from "@/components/ProviderSelector";
import { StatefulButton } from "@/components/ui/stateful-button";
import { Highlighter } from "@/components/ui/highlighter";
import type { Provider } from "@/lib/validateKey";

type Props = {
  initialUploadsLeft: number;
};

const GOOGLE_SANS_STACK = 'font-["Google Sans","Product Sans","Arial",sans-serif]';

export function UploadForm({ initialUploadsLeft }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("pdf");
  const [provider, setProvider] = useState<Provider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [latexCode, setLatexCode] = useState<string | null>(null);
  const [latexOpen, setLatexOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("resume.pdf");
  const [latexCopied, setLatexCopied] = useState(false);
  const [uploadsLeft, setUploadsLeft] = useState(initialUploadsLeft);
  const [activeStep, setActiveStep] = useState<string>("upload");

  const onDrop = useCallback((accepted: File[]) => {
    setError(null);
    setFile(accepted[0] ?? null);
    setActiveStep("provider");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
  });

  const canSubmit = useMemo(() => {
    if (uploadsLeft <= 0) return false;
    if (!file) return false;
    if (!verified) return false;
    if (!apiKey.trim()) return false;
    return true;
  }, [uploadsLeft, file, verified, apiKey]);

  const dayPart = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    return "Evening";
  }, []);

  async function submit() {
    if (!file) return;
    if (uploadsLeft <= 0) {
      setError("No uploads left.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
        setPdfPreviewUrl(null);
      }
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
        setDownloadUrl(null);
      }
      setLatexCode(null);
      setLatexOpen(false);
      setLatexCopied(false);
      setDownloadName(outputFormat === "latex" ? "resume.tex" : "resume.pdf");

      const form = new FormData();
      form.set("file", file);
      form.set("outputFormat", outputFormat === "pdf" ? "hybrid" : "latex");
      form.set("provider", provider);
      form.set("apiKey", apiKey);

      const res = await fetch("/api/resume", { method: "POST", body: form });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string; latex?: string; uploadsLeft?: number }
          | null;
        if (typeof data?.uploadsLeft === "number") {
          setUploadsLeft(data.uploadsLeft);
        }
        if (data?.latex) {
          setLatexCode(data.latex);
          setLatexOpen(true);
          const texBlob = new Blob([data.latex], { type: "application/x-tex" });
          const texUrl = URL.createObjectURL(texBlob);
          setDownloadUrl(texUrl);
          setDownloadName("resume.tex");
        }
        throw new Error(data?.error ?? "Resume processing failed");
      }

      if (outputFormat === "pdf") {
        const data = (await res.json()) as {
          latex: string;
          pdfBase64: string;
          mime?: string;
          filename?: string;
          uploadsLeft?: number;
        };
        if (typeof data.uploadsLeft === "number") {
          setUploadsLeft(data.uploadsLeft);
        }
        setLatexCode(data.latex);
        setLatexOpen(true);

        const binary = atob(data.pdfBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) {
          bytes[i] = binary.charCodeAt(i);
        }
        const pdfBlob = new Blob([bytes], {
          type: data.mime ?? "application/pdf",
        });
        const url = URL.createObjectURL(pdfBlob);
        setPdfPreviewUrl(url);
        setDownloadUrl(url);
        setDownloadName(data.filename ?? "resume.pdf");

        const a = document.createElement("a");
        a.href = url;
        a.download = data.filename ?? "resume.pdf";
        a.click();
      } else {
        const text = await res.text();
        const left = Number(res.headers.get("x-uploads-left"));
        if (Number.isFinite(left)) {
          setUploadsLeft(left);
        }
        setLatexCode(text);
        setLatexOpen(true);
        const texBlob = new Blob([text], { type: "application/x-tex" });
        const texUrl = URL.createObjectURL(texBlob);
        setDownloadUrl(texUrl);
        setDownloadName("resume.tex");

        const a = document.createElement("a");
        a.href = texUrl;
        a.download = "resume.tex";
        a.click();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copyLatex() {
    if (!latexCode) return;
    await navigator.clipboard.writeText(latexCode);
    setLatexCopied(true);
    window.setTimeout(() => setLatexCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className={`${GOOGLE_SANS_STACK} text-5xl font-[350] text-black`}>
          Good {dayPart.toLowerCase()}, let&apos;s start!
        </h1>
        <p className={`${GOOGLE_SANS_STACK} text-base font-normal text-zinc-400`}>
          You have
          <span className="mx-[0.9rem] inline-block">
            <Highlighter
              action="highlight"
              color="#c4f3ce"
              strokeWidth={2}
              animationDuration={500}
            >
              <span className="text-zinc-500">{uploadsLeft}</span>
            </Highlighter>
          </span>
          uploads left
        </p>
      </div>

      {uploadsLeft <= 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          You are out of uploads. Contact support to reset your limit.
        </div>
      ) : null}

      <div className="rounded-3xl border border-zinc-200 bg-white px-6">
        <Accordion
          type="single"
          collapsible
          value={activeStep}
          onValueChange={(value) => setActiveStep(value || "")}
        >
          <AccordionItem value="upload" className="border-zinc-200">
            <AccordionTrigger
              className={`${GOOGLE_SANS_STACK} py-5 text-5xl font-normal text-black hover:no-underline`}
            >
              1. Drop Your Resume
            </AccordionTrigger>
            <AccordionContent>
              <div
                {...getRootProps()}
                className={`mt-2 cursor-pointer rounded-2xl border border-dashed p-8 text-center ${
                  isDragActive
                    ? "border-zinc-400 bg-zinc-50"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                }`}
              >
                <input {...getInputProps()} />
                <p className={`${GOOGLE_SANS_STACK} text-sm font-normal text-black`}>
                  Drop your resume here, or click to browse
                </p>
                <p className={`${GOOGLE_SANS_STACK} mt-2 text-xs font-normal text-zinc-500`}>
                  PDF or DOCX - max 5MB
                </p>
                {file ? (
                  <p className={`${GOOGLE_SANS_STACK} mt-3 text-sm font-normal text-black`}>
                    Selected: {file.name}
                  </p>
                ) : null}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="provider" className="border-zinc-200">
            <AccordionTrigger
              className={`${GOOGLE_SANS_STACK} py-5 text-5xl font-normal text-black hover:no-underline`}
            >
              2. AI Provider
            </AccordionTrigger>
            <AccordionContent>
              <p className={`${GOOGLE_SANS_STACK} text-xs font-normal text-zinc-500`}>
                Your API key is sent only for this request.
              </p>
              <div className="mt-4">
                <ProviderSelector
                  provider={provider}
                  apiKey={apiKey}
                  onChange={(next) => {
                    setProvider(next.provider);
                    setApiKey(next.apiKey);
                    setVerified(next.verified);
                    if (next.verified) setActiveStep("output");
                  }}
                />
                {verified ? (
                  <p className={`${GOOGLE_SANS_STACK} mt-3 text-sm font-normal text-emerald-700`}>
                    Key verified.
                  </p>
                ) : null}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="output" className="border-zinc-200">
            <AccordionTrigger
              className={`${GOOGLE_SANS_STACK} py-5 text-5xl font-normal text-black hover:no-underline`}
            >
              3. Choose your output
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className={`${GOOGLE_SANS_STACK} text-xs font-normal text-zinc-500`}>
                  Download as LaTeX or a compiled PDF.
                </p>
                <OutputSelector value={outputFormat} onChange={setOutputFormat} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <StatefulButton
        type="button"
        disabled={!canSubmit || loading}
        onClick={submit}
        layoutId="generate-button"
        className={`${GOOGLE_SANS_STACK} mx-auto h-12 max-w-xs rounded-full bg-black text-base font-normal text-white hover:bg-zinc-800`}
      >
        {loading ? "Working..." : "Generate"}
      </StatefulButton>

      {pdfPreviewUrl ? (
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-zinc-950">
            Preview
          </p>
          <div className="h-[480px] w-full overflow-hidden rounded-2xl border border-zinc-200">
            <iframe
              src={pdfPreviewUrl}
              title="Resume preview"
              className="h-full w-full"
            />
          </div>
        </div>
      ) : null}

      {latexCode ? (
        <div className="mt-4 rounded-3xl border border-zinc-200 bg-white">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setLatexOpen((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setLatexOpen((v) => !v);
              }
            }}
            className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-zinc-950"
          >
            <span>LaTeX output</span>
            <span className="flex items-center gap-2 text-xs text-zinc-500">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  void copyLatex();
                }}
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-zinc-700 hover:bg-zinc-50"
              >
                {latexCopied ? "Copied" : "Copy"}
              </button>
              <span>{latexOpen ? "Hide" : "Show"}</span>
            </span>
          </div>
          {latexOpen ? (
            <div className="max-h-80 overflow-auto border-t border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-mono text-zinc-800">
              <pre className="whitespace-pre-wrap text-zinc-950">
{latexCode}
              </pre>
            </div>
          ) : null}
        </div>
      ) : null}

      {downloadUrl ? (
        <div className="flex items-center gap-3">
          <a
            href={downloadUrl}
            download={downloadName}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
          >
            Download
          </a>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <p
        className={`${GOOGLE_SANS_STACK} text-center text-xs font-normal text-zinc-400 sm:fixed sm:bottom-[5px] sm:left-1/2 sm:z-10 sm:-translate-x-1/2`}
      >
        AI Generated Content. User intervention may be needed.
      </p>
    </div>
  );
}

