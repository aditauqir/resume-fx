"use client";

import { useEffect, useState } from "react";

type Props = {
  initialCode: string;
  updatedAt: string | null;
};

export function TemplateEditor({ initialCode, updatedAt }: Props) {
  const [latex, setLatex] = useState(initialCode);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    setLatex(initialCode);
  }, [initialCode]);

  async function save() {
    setSaving(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/template", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ latex_code: latex }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string; code?: string }
          | null;
        throw new Error(data?.error ?? "Save failed");
      }
      setResult("Saved.");
    } catch (e) {
      setResult(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-950">LaTeX template</p>
          <p className="mt-1 text-xs text-zinc-600">
            Use a placeholder like <code className="font-mono">{"<<CONTENT>>"}</code>{" "}
            where AI output should go.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Last updated: {updatedAt ?? "—"}
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <textarea
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
        className="min-h-[420px] w-full resize-y rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-mono text-xs leading-5 text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-zinc-400"
        placeholder="Paste your LaTeX template here..."
      />

      {result ? <p className="text-sm text-zinc-700">{result}</p> : null}
    </div>
  );
}

