"use client";

import { useState } from "react";

type Props = {
  title: string;
  description?: string;
};

export function AuthAlertDialog({ title, description }: Props) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
            ✓
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-zinc-950">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-zinc-600">{description}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-zinc-950 px-4 text-xs font-medium text-white hover:bg-zinc-800"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

