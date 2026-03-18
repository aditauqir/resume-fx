"use client";

import Image from "next/image";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

const WandIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faWandMagicSparkles} className={className} />
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const InboxIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const featureItems = [
  {
    title: "One-page focus",
    description: "Most resumes are outdated. Fine-tune yours for today's hiring pipelines—built to pass algorithms and stand out instantly.",
    shortDescription: "Most resumes are outdated. Fine-tune yours for today.",
    Icon: undefined,
    className: "col-span-1 sm:col-span-2",
    background: (
      <Image
        src="/resume-preview.png"
        alt="Resume preview"
        fill
        className="object-cover object-top opacity-80"
      />
    ),
  },
  {
    title: "Fuss Free.",
    description: "Simple, quick and easy. One drag and drop to thousands of opportunities.",
    shortDescription: "Simple, quick and easy.",
    Icon: WandIcon,
  },
  {
    title: "Daily limit",
    description: "Prevents spam and keeps costs predictable.",
    Icon: ShieldIcon,
  },
  {
    title: "Support inbox",
    description: "Built-in support tickets with status tracking.",
    Icon: InboxIcon,
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:px-16 lg:pl-[calc(6rem+25px)] lg:pr-24">
      <h2 className="mb-8 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
        Built for{" "}
        <PointerHighlight>
          <span>efficiency</span>
        </PointerHighlight>
      </h2>
      <BentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[14rem]">
        {featureItems.map((f) => (
          <BentoCard
            key={f.title}
            name={f.title}
            description={f.description}
            shortDescription={f.shortDescription}
            Icon={f.Icon}
            background={f.background}
            className={f.className || "col-span-1"}
          />
        ))}
      </BentoGrid>
    </section>
  );
}

