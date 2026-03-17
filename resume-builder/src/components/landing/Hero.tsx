import Link from "next/link";
import { landing } from "@/content/landing";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">
        <p className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
          Next.js + Supabase + AI
        </p>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          {landing.hero.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-zinc-600">
          {landing.hero.subheadline}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/app"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {landing.hero.cta}
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}

