"use client";

import { useMemo, useState } from "react";

export type PromptStep = {
  id: string;
  step_order: number;
  prompt_text: string;
  is_active: boolean;
};

type Props = {
  initialSteps: PromptStep[];
};

export function PromptChain({ initialSteps }: Props) {
  const [steps, setSteps] = useState<PromptStep[]>(initialSteps);
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...steps].sort((a, b) => a.step_order - b.step_order),
    [steps],
  );

  async function reload() {
    const res = await fetch("/api/admin/prompts");
    const data = (await res.json()) as PromptStep[];
    setSteps(data);
  }

  async function add() {
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/prompts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt_text: newText }),
      });
      if (!res.ok) throw new Error("Add failed");
      setNewText("");
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Add failed");
    } finally {
      setAdding(false);
    }
  }

  async function toggleActive(step: PromptStep) {
    await fetch(`/api/admin/prompts/${step.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ is_active: !step.is_active }),
    });
    await reload();
  }

  async function updateText(step: PromptStep, prompt_text: string) {
    await fetch(`/api/admin/prompts/${step.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt_text }),
    });
    await reload();
  }

  async function remove(step: PromptStep) {
    await fetch(`/api/admin/prompts/${step.id}`, { method: "DELETE" });
    await reload();
  }

  async function move(step: PromptStep, dir: -1 | 1) {
    const target = sorted.find((s) => s.step_order === step.step_order + dir);
    if (!target) return;
    await fetch(`/api/admin/prompts/${step.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ step_order: target.step_order }),
    });
    await fetch(`/api/admin/prompts/${target.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ step_order: step.step_order }),
    });
    await reload();
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-zinc-950">Prompt chain</p>
        <p className="mt-1 text-xs text-zinc-600">
          Steps run top-to-bottom. Toggle inactive to skip a step.
        </p>
      </div>

      <div className="space-y-3">
        {sorted.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium text-zinc-600">
                Step {s.step_order}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => move(s, -1)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1 text-xs hover:bg-zinc-50"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(s, 1)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1 text-xs hover:bg-zinc-50"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => toggleActive(s)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1 text-xs hover:bg-zinc-50"
                >
                  {s.is_active ? "Active" : "Inactive"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(s)}
                  className="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>

            <PromptTextEditor
              value={s.prompt_text}
              onSave={(v) => updateText(s, v)}
              disabled={!s.is_active}
            />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <p className="text-xs font-medium text-zinc-700">Add step</p>
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="mt-2 min-h-24 w-full resize-y rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          placeholder="Type a new instruction..."
        />
        <button
          type="button"
          onClick={add}
          disabled={adding || !newText.trim()}
          className="mt-3 inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white disabled:opacity-60"
        >
          {adding ? "Adding..." : "Add"}
        </button>
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      </div>
    </div>
  );
}

function PromptTextEditor({
  value,
  onSave,
  disabled,
}: {
  value: string;
  onSave: (next: string) => void;
  disabled?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  return editing ? (
    <div className="mt-3 space-y-2">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="min-h-24 w-full resize-y rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 disabled:opacity-60"
        disabled={disabled}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            onSave(draft);
            setEditing(false);
          }}
          className="inline-flex h-9 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white disabled:opacity-60"
          disabled={disabled || !draft.trim()}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(value);
            setEditing(false);
          }}
          className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="mt-3 block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100"
    >
      {value}
    </button>
  );
}

