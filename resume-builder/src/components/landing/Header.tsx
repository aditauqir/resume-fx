"use client";

import Link from "next/link";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useIsMobile(500);

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-center px-6 pt-[calc(1.5rem+0.7rem)] sm:justify-between sm:px-16 lg:pl-[calc(6rem+25px)] lg:pr-24">
      <Link href="/" className="flex items-center">
        {isMobile ? (
          <Image
            src="/fix_my_resume_icon.svg"
            alt="Fix my Resume"
            width={96}
            height={96}
            className="h-[6rem] w-[6rem]"
          />
        ) : (
          <span className="font-[var(--font-inter)] text-[1.3rem] font-normal tracking-normal text-[#293238]">
            Fix my Resume
          </span>
        )}
      </Link>
      {!isMobile && (
        <Image
          src="/fix_my_resume_icon.svg"
          alt="Fix my Resume"
          width={80}
          height={80}
          className="h-[5rem] w-[5rem]"
        />
      )}
    </header>
  );
}
