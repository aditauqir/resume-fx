"use client";

export type OutputFormat = "pdf" | "latex";

type Props = {
  value: OutputFormat;
  onChange: (v: OutputFormat) => void;
};

export function OutputSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange("pdf")}
        className={`rounded-full px-4 py-2 text-sm font-medium ${
          value === "pdf"
            ? "bg-zinc-950 text-white"
            : "border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50"
        }`}
      >
        PDF
      </button>
      <button
        type="button"
        onClick={() => onChange("latex")}
        className={`rounded-full px-4 py-2 text-sm font-medium ${
          value === "latex"
            ? "bg-zinc-950 text-white"
            : "border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50"
        }`}
      >
        LaTeX
      </button>
    </div>
  );
}

