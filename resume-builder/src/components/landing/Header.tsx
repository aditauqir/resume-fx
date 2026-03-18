"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center px-6 pt-[calc(1.5rem+0.7rem)] sm:px-16 lg:pl-[calc(6rem+25px)] lg:pr-24">
      <Link
        href="/"
        className="font-[var(--font-inter)] text-[1.3rem] font-normal tracking-normal text-[#293238]"
      >
        Fix my Resume
      </Link>
    </header>
  );
}
