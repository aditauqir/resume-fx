import { landing } from "@/content/landing";

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
        {landing.footer.copyright}
      </div>
    </footer>
  );
}

