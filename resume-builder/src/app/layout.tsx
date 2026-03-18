import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SupportButton } from "@/components/SupportButton";
import { ThemeProvider } from "@/components/theme-provider";
import { SupportProvider } from "@/context/SupportContext";

const googleSans = localFont({
  src: [
    {
      path: "./fonts/GoogleSans.ttf",
      style: "normal",
    },
    {
      path: "./fonts/GoogleSans-Italic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-google-sans",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${googleSans.variable} bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <SupportProvider>
            {children}
            <SupportButton userEmail={null} />
          </SupportProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
