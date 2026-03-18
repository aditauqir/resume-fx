"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function FloatingThemeToggler() {
  return (
    <AnimatedThemeToggler
      className="fixed right-[4.5rem] bottom-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-white shadow-lg hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
      duration={400}
    />
  );
}
