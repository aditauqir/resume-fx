"use client";

import {
  useRef,
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
} from "react";
import { motion, MotionValue, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string;
}

export const TextReveal: FC<TextRevealProps> = ({ children, className }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
  });

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string");
  }

  const words = children.split(" ");

  return (
    <div ref={sectionRef} className={cn("relative z-0 h-[70vh] pt-[152px]", className)}>
      <div
        className={
          "sticky top-0 mx-auto flex h-[50%] max-w-6xl items-center bg-transparent px-6 py-8 sm:px-16 lg:pl-[calc(6rem+40px)] lg:pr-24"
        }
      >
        <span
          className={
            "flex flex-wrap text-2xl font-bold md:text-3xl lg:text-4xl xl:text-5xl"
          }
          style={{ fontFamily: "Arial, Helvetica, sans-serif", color: "rgba(0, 0, 0, 0.2)" }}
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </span>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-1.5">
      <span className="absolute opacity-30">{children}</span>
      <motion.span
        style={{ opacity: opacity, color: "black", fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        {children}
      </motion.span>
    </span>
  );
};
