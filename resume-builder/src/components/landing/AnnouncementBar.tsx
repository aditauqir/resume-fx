"use client";

import { useState } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSupport } from "@/context/SupportContext";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const { openSupport } = useSupport();

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 bg-black"
      style={{ fontFamily: "var(--font-google-sans), Arial, Helvetica, sans-serif" }}
    >
      <div className="mx-auto flex h-[2.4rem] max-w-6xl items-center justify-center gap-4 px-4 sm:px-6">
        <p className="text-xs text-white/90">
          Note: This is a beta product. Any feedback would be appreciated for me to improve
        </p>
        
        <HoverBorderGradient
          containerClassName="rounded-full h-4"
          className="bg-black px-[0.4rem] py-[0.4rem] text-[9px] leading-none h-full flex items-center"
          onClick={openSupport}
        >
          Submit a ticket
        </HoverBorderGradient>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 text-white/70 transition-colors hover:text-white sm:right-6"
          aria-label="Close announcement"
        >
          <FontAwesomeIcon icon={faXmark} className="h-1 w-1" />
        </button>
      </div>
    </div>
  );
}
