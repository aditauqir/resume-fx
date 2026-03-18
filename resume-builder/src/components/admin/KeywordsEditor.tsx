"use client";

import { useEffect, useState } from "react";

type Props = {
  initialKeywords: string;
  updatedAt: string | null;
};

export function KeywordsEditor({ initialKeywords, updatedAt }: Props) {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    setKeywords(initialKeywords);
  }, [initialKeywords]);

  async function save() {
    setSaving(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/keywords", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ keywords }),
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-950">Keywords</p>
          <p className="mt-1 text-xs text-zinc-600">
            Add comma-separated keywords that should be emphasized in generated
            resumes.
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
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="min-h-[220px] w-full resize-y rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-zinc-400"
        placeholder="e.g. leadership, project management, Python, React"
      />

      {result ? <p className="text-sm text-zinc-700">{result}</p> : null}
    </div>
  );
}
