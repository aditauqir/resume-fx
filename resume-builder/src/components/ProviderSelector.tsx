"use client";

import { useMemo, useState } from "react";
import type { Provider } from "@/lib/validateKey";
import { validateKeyFormat } from "@/lib/validateKey";

type Props = {
  provider: Provider;
  apiKey: string;
  onChange: (next: { provider: Provider; apiKey: string; verified: boolean }) => void;
};

export function ProviderSelector({ provider, apiKey, onChange }: Props) {
  const [verifying, setVerifying] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formatError = useMemo(() => validateKeyFormat(provider, apiKey), [provider, apiKey]);

  async function verify() {
    setServerError(null);
    if (provider === "ollama") {
      // No real remote validation; just mark as verified if model name is present.
      if (!apiKey.trim()) {
        setServerError("Model name is required");
        return;
      }
      onChange({ provider, apiKey, verified: true });
      return;
    }
    const err = validateKeyFormat(provider, apiKey);
    if (err) {
      setServerError(err);
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });
      const data = (await res.json()) as { valid: boolean; error?: string };
      if (!res.ok || !data.valid) throw new Error(data.error ?? "Invalid key");
      onChange({ provider, apiKey, verified: true });
    } catch (e) {
      onChange({ provider, apiKey, verified: false });
      setServerError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["claude", "openai", "gemini", "ollama"] as Provider[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange({ provider: p, apiKey: "", verified: false })}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              provider === p
                ? "bg-zinc-950 text-white"
                : "border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50"
            }`}
            >
            {p === "openai"
              ? "OpenAI"
              : p === "claude"
                ? "Claude"
                : p === "gemini"
                  ? "Gemini"
                  : "Ollama"}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="text-xs font-medium text-zinc-700">
          {provider === "ollama" ? "Ollama model (local)" : "API Key"}
        </span>
        <input
          value={apiKey}
          onChange={(e) =>
            onChange({ provider, apiKey: e.target.value, verified: false })
          }
          placeholder={
            provider === "ollama"
              ? "qwen2.5:7b or llama3.1:8b"
              : provider === "gemini"
                ? "AIza..."
                : provider === "claude"
                  ? "sk-ant-..."
                  : "sk-..."
          }
          className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={verify}
          disabled={verifying || !!formatError}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifying ? "Verifying..." : "Verify Key"}
        </button>
        <p className="text-xs text-zinc-600">
          We only run a minimal validation call.
        </p>
      </div>

      {formatError || serverError ? (
        <p className="text-sm text-red-700">{formatError ?? serverError}</p>
      ) : null}
    </div>
  );
}

