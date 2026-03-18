import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SupportButton } from "@/components/SupportButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Upload a resume and get a polished PDF or LaTeX.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // #region agent log
  await fetch("http://127.0.0.1:7489/ingest/05527899-20a9-45e1-907b-6d2b6302efe8", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "973277" },
    body: JSON.stringify({
      sessionId: "973277",
      runId: "run2",
      hypothesisId: "H1",
      location: "src/app/layout.tsx:24",
      message: "Root layout render",
      data: { childrenPresent: Boolean(children) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        {children}
        <SupportButton userEmail={null} />
      </body>
    </html>
  );
}
