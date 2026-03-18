 "use client";

import Link from "next/link";
import * as React from "react";

export function SignUpForm() {
  const passwordInputRef = React.useRef<HTMLInputElement | null>(null);

  function onEmailKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  }

  return (
    <div className="gap-6">
      <div className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5 rounded-3xl border bg-white">
        <div className="border-b border-zinc-100 px-6 py-5 sm:px-8">
          <h1 className="text-center text-xl font-semibold tracking-tight text-zinc-950 sm:text-left">
            Create your account
          </h1>
          <p className="mt-1 text-center text-sm text-zinc-600 sm:text-left">
            Welcome! Please fill in the details to get started.
          </p>
        </div>
        <div className="gap-6 px-6 py-6 sm:px-8">
          <div className="gap-6 space-y-4">
            <div className="gap-1.5 space-y-1">
              <label
                htmlFor="email"
                className="text-xs font-medium text-zinc-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-zinc-400"
                onKeyDown={onEmailKeyDown}
              />
            </div>
            <div className="gap-1.5 space-y-1">
              <label
                htmlFor="password"
                className="text-xs font-medium text-zinc-700"
              >
                Password
              </label>
              <input
                ref={passwordInputRef}
                id="password"
                name="password"
                type="password"
                minLength={8}
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-zinc-400"
                placeholder="At least 8 characters"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Continue
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-sm underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
          
          {/* Placeholder for future social connections */}
        </div>
      </div>
    </div>
  );
}

