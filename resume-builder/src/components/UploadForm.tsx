"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { OutputSelector, type OutputFormat } from "@/components/OutputSelector";
import { ProviderSelector } from "@/components/ProviderSelector";
import type { Provider } from "@/lib/validateKey";

type Props = {
  alreadyUsedToday: boolean;
};

export function UploadForm({ alreadyUsedToday }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("pdf");
  const [provider, setProvider] = useState<Provider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    setError(null);
    setFile(accepted[0] ?? null);
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
    if (alreadyUsedToday) return false;
    if (!file) return false;
    if (!verified) return false;
    if (!apiKey.trim()) return false;
    return true;
  }, [alreadyUsedToday, file, verified, apiKey]);

  async function submit() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("outputFormat", outputFormat);
      form.set("provider", provider);
      form.set("apiKey", apiKey);

      const res = await fetch("/api/resume", { method: "POST", body: form });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Resume processing failed");
      }

      const blob = await res.blob();
      const ext = outputFormat === "pdf" ? "pdf" : "tex";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {alreadyUsedToday ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Daily limit reached. Try again tomorrow.
        </div>
      ) : null}

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-3xl border border-dashed p-10 text-center ${
          isDragActive
            ? "border-zinc-400 bg-zinc-50"
            : "border-zinc-200 bg-white hover:bg-zinc-50"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm font-medium text-zinc-950">
          Drop your resume here, or click to browse
        </p>
        <p className="mt-2 text-xs text-zinc-600">PDF or DOCX • max 5MB</p>
        {file ? (
          <p className="mt-3 text-sm text-zinc-700">Selected: {file.name}</p>
        ) : null}
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-950">Output</p>
            <p className="mt-1 text-xs text-zinc-600">
              Download as LaTeX or a compiled PDF.
            </p>
          </div>
          <OutputSelector value={outputFormat} onChange={setOutputFormat} />
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="text-sm font-semibold text-zinc-950">AI Provider</p>
        <p className="mt-1 text-xs text-zinc-600">
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
            }}
          />
          {verified ? (
            <p className="mt-3 text-sm text-emerald-700">Key verified.</p>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        disabled={!canSubmit || loading}
        onClick={submit}
        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-950 px-6 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Working..." : "Generate"}
      </button>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

