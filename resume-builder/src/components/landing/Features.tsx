"use client";

import Image from "next/image";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { TweetCard } from "@/components/ui/tweet-card";
import { NumberTicker } from "@/components/ui/number-ticker";

const WandIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faWandMagicSparkles} className={className} />
);

const DollarIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faHandHoldingDollar} className={className} />
);

const PricingTitle = () => (
  <span>
    start for <span className="text-[#2CA24C]">$<NumberTicker 
      value={0} 
      startValue={100} 
      direction="up"
    /></span> today
  </span>
);

const featureItems = [
  {
    id: "one-page",
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
    id: "connections",
    title: "Better connections",
    description: "Connect with opportunities worldwide. Get better opportunities with networking, and recruiters.",
    shortDescription: "Connect with opportunities worldwide.",
    Icon: undefined,
    className: "col-span-1 sm:col-span-2 sm:row-span-2",
    yOffset: 20,
    background: (
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <TweetCard
          name="Martha 💫"
          handle="m.preeta"
          avatar="/avatar.png"
          text="I got hired as a software engineer at Cisco! Fix My Resume helped me immensely with landing my dream job. The AI powered resume builder made all the difference!"
          image="/tweet-image.png"
          className="scale-90 transform"
        />
      </div>
    ),
  },
  {
    id: "fuss-free",
    title: "Fuss Free.",
    description: "Simple, quick and easy. One drag and drop to thousands of opportunities.",
    shortDescription: "Simple, quick and easy.",
    Icon: WandIcon,
    bottomAlign: true,
  },
  {
    id: "pricing",
    title: <PricingTitle />,
    description: "We use custom models, or bring your own model to the mix!",
    Icon: DollarIcon,
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
            key={f.id}
            name={f.title}
            description={f.description}
            shortDescription={f.shortDescription}
            Icon={f.Icon}
            background={f.background}
            bottomAlign={f.bottomAlign}
            yOffset={f.yOffset}
            className={f.className || "col-span-1"}
          />
        ))}
      </BentoGrid>
    </section>
  );
}

