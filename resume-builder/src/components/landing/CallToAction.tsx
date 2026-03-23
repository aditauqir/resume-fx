"use client";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export function CallToAction() {
  return (
    <section className="mx-auto flex max-w-6xl items-center justify-center px-6 py-16 sm:px-16 lg:pl-[calc(6rem+25px)] lg:pr-24">
      <InteractiveHoverButton
        className="text-base"
        onClick={() => {
          window.location.href = "/login";
        }}
      >
        Get started now!
      </InteractiveHoverButton>
    </section>
  );
}
