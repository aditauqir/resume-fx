"use client";

import { landing } from "@/content/landing";
import { ShinyButton } from "@/components/ui/shiny-button";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CSSProperties } from "react";

export function Hero() {
  const isMobile = useIsMobile(500)

  return (
    <section className="relative mx-auto flex min-h-[72vh] max-w-6xl items-center px-6 py-8">
      <div className={`relative flex min-h-[72vh] w-full gap-8 px-6 py-14 sm:px-16 lg:px-24 ${
        isMobile 
          ? "flex-col items-center justify-center text-center" 
          : "flex-row items-center justify-between"
      }`}>
        <div className={`max-w-[16rem] ${isMobile ? "text-center" : "text-left"}`}>
          <h1 className={`text-balance text-[1.75rem] font-medium tracking-tight text-slate-950 sm:text-[2.5rem] ${isMobile ? "leading-[0.85]" : "leading-[0.95]"}`} style={{ fontFamily: "var(--font-raleway), sans-serif" }}>
            <TypingAnimation
              duration={150}
              typeSpeed={90}
              deleteSpeed={45}
              delay={3}
              pauseDelay={1500}
              loop={false}
              showCursor={true}
              blinkCursor={true}
              cursorStyle="line"
            >
              {landing.hero.headline}
            </TypingAnimation>
          </h1>
        </div>
        <div className={`flex flex-col items-center gap-4 ${isMobile ? "mt-[0.3rem]" : ""}`}>
          <ShinyButton
            onClick={() => {
              window.location.href = "/login";
            }}
            style={{ "--primary": "rgb(15 23 42 / 0.95)", fontFamily: "var(--font-google-sans), Arial, Helvetica, sans-serif" } as CSSProperties}
            className="min-w-44 border-0 bg-slate-950 px-8 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Get Started
          </ShinyButton>
        </div>
      </div>
    </section>
  );
}

