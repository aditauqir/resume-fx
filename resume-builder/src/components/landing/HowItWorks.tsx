import { landing } from "@/content/landing";

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:px-16 lg:pl-[calc(6rem+25px)] lg:pr-24">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
        {landing.howItWorks.title}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {landing.howItWorks.steps.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl bg-[#F2F2F2] p-6"
          >
            <p className="text-sm font-medium text-zinc-950">
              {s.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

