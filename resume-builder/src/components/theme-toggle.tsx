"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import * as ToggleGroup from "@rn-primitives/toggle-group";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="inline-flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm">
        <div className="h-8 w-24 rounded-full bg-zinc-100" />
      </div>
    );
  }

  return (
    <ToggleGroup.Root
      type="single"
      value={theme}
      onValueChange={(next) => setTheme(next ?? "system")}
      className="inline-flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm"
    >
      {OPTIONS.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "inline-flex h-8 items-center justify-center rounded-full px-3 text-xs font-medium text-zinc-600 transition-colors",
            "aria-selected:bg-zinc-950 aria-selected:text-white",
            "hover:text-zinc-950",
          )}
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
