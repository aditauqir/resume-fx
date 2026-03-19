"use client";

import { useMemo, useState, type MouseEvent } from "react";
import { useSupport } from "@/context/SupportContext";
import { StatefulButton } from "@/components/ui/stateful-button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  userEmail?: string | null;
};

export function SupportButton({ userEmail }: Props) {
  const { isOpen: open, openSupport, closeSupport } = useSupport();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(userEmail ?? "");
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const emailRequired = useMemo(() => !userEmail, [userEmail]);

  async function submit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setResult(null);
    try {
      // #region agent log
      await fetch("http://127.0.0.1:7489/ingest/05527899-20a9-45e1-907b-6d2b6302efe8", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "973277" },
        body: JSON.stringify({
          sessionId: "973277",
          runId: "run3",
          hypothesisId: "H3",
          location: "src/components/SupportButton.tsx:21",
          message: "Support submit clicked",
          data: {
            subjectLength: subject.trim().length,
            messageLength: message.trim().length,
            emailRequired,
            emailLength: email.trim().length,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

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
          | { error?: string; detail?: string; code?: string | null; hint?: string | null }
          | null;
        // #region agent log
        await fetch("http://127.0.0.1:7489/ingest/05527899-20a9-45e1-907b-6d2b6302efe8", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "973277" },
          body: JSON.stringify({
            sessionId: "973277",
            runId: "run3",
            hypothesisId: "H4",
            location: "src/components/SupportButton.tsx:34",
            message: "Support submit received non-ok response",
            data: {
              status: res.status,
              error: data?.error ?? null,
              detail: data?.detail ?? null,
              code: data?.code ?? null,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        throw new Error(data?.detail ?? data?.error ?? "Support request failed");
      }
      // #region agent log
      await fetch("http://127.0.0.1:7489/ingest/05527899-20a9-45e1-907b-6d2b6302efe8", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "973277" },
        body: JSON.stringify({
          sessionId: "973277",
          runId: "run3",
          hypothesisId: "H4",
          location: "src/components/SupportButton.tsx:43",
          message: "Support submit succeeded",
          data: { status: res.status },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      setSubject("");
      setMessage("");
      setResult({ ok: true, text: "Thanks! We'll get back to you soon." });
    } catch (e) {
      setResult({
        ok: false,
        text: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openSupport}
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
                onClick={closeSupport}
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
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400"
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
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-400"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What can we help with?"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-zinc-700">
                  Message
                </span>
                <Textarea
                  className="mt-1 min-h-28 resize-y"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's happening..."
                />
              </label>

              <StatefulButton
                onClick={submit}
                disabled={!subject.trim() || !message.trim()}
              >
                Submit
              </StatefulButton>

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

