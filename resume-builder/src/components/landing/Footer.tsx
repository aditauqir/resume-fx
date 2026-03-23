import { landing } from "@/content/landing";

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-12 sm:px-16 lg:pl-[calc(6rem+25px)] lg:pr-24">
      <p className="text-sm text-black">
        {landing.footer.copyright}
      </p>
    </footer>
  );
}

