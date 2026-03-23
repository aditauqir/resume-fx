"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ShinyButton } from "@/components/ui/shiny-button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-4 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-6 w-11 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <ShinyButton
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{ "--primary": "rgb(24 24 27)" } as CSSProperties}
      className="flex items-center rounded-full border border-zinc-300 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-800"
    >
      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </ShinyButton>
  );
}
