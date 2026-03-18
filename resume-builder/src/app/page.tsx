import { Hero } from "@/components/landing/Hero";
import { Header } from "@/components/landing/Header";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { DotPattern } from "@/components/ui/dot-pattern";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#FAFCFC] text-foreground">
      <DotPattern
        className="fixed inset-0 z-0 h-full w-full"
        glow={true}
      />
      <div className="relative z-10">
        <Header />
        <Hero />
        <HowItWorks />
        <Features />
        <Footer />
      </div>
      <ProgressiveBlur height="20%" position="bottom" hideOnScrollEnd blurLevels={[0.3, 0.5, 1, 2, 4, 8.5, 16, 32]} />
    </div>
  );
}
