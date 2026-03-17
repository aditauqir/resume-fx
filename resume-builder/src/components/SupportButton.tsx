"use client";

import { useMemo, useState } from "react";

type Props = {
  userEmail?: string | null;
};

export function SupportButton({ userEmail }: Props) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(userEmail ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const emailRequired = useMemo(() => !userEmail, [userEmail]);

  async function submit() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          subject,
          message,
          user_email: emailRequired ? email : undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Support request failed");
      }
      setSubject("");
      setMessage("");
      setResult({ ok: true, text: "Thanks! We'll get back to you soon." });
    } catch (e) {
      setResult({
        ok: false,
        text: e instanceof Error ? e.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-white shadow-lg hover:bg-zinc-800"
        aria-label="Support"
      >
        ?
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-950">Support</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {emailRequired ? (
                <label className="block">
                  <span className="text-xs font-medium text-zinc-700">
                    Email (optional)
                  </span>
                  <input
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="text-xs font-medium text-zinc-700">
                  Subject
                </span>
                <input
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What can we help with?"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-zinc-700">
                  Message
                </span>
                <textarea
                  className="mt-1 min-h-28 w-full resize-y rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's happening..."
                />
              </label>

              <button
                type="button"
                disabled={loading || !subject.trim() || !message.trim()}
                onClick={submit}
                className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Submit"}
              </button>

              {result ? (
                <p
                  className={`text-sm ${
                    result.ok ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {result.text}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

