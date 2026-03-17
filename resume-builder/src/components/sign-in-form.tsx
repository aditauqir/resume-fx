 "use client";

import Link from "next/link";
import * as React from "react";

export function SignInForm() {
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
            Sign in to your app
          </h1>
          <p className="mt-1 text-center text-sm text-zinc-600 sm:text-left">
            Welcome back! Please sign in to continue
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
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                onKeyDown={onEmailKeyDown}
              />
            </div>
            <div className="gap-1.5 space-y-1">
              <div className="flex items-center">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-zinc-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="ml-auto h-4 px-1 py-0 text-xs text-zinc-600 underline"
                >
                  Forgot your password?
                </button>
              </div>
              <input
                ref={passwordInputRef}
                id="password"
                name="password"
                type="password"
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
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
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-sm underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
          {/* Placeholder for future social connections */}
        </div>
      </div>
    </div>
  );
}
