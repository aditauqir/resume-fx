"use client";

import * as React from "react";
import { StatefulButton } from "@/components/ui/stateful-button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminSignInFormProps {
  serverError?: string | null;
}

export function AdminSignInForm({ serverError }: AdminSignInFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(serverError || null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const passwordInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (serverError) {
      setError(serverError);
    }
  }, [serverError]);

  function onEmailKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await fetch("/admin/auth/login", {
        method: "POST",
        body: formData,
      });

      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Admin login failed");
      }

      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gap-6 font-[Arial,Helvetica,sans-serif]">
      <div className="rounded-lg bg-white px-6 py-6 sm:px-8">
        <div className="mb-6">
          <h1 className="text-center text-xl font-semibold tracking-tight text-zinc-950 sm:text-left">
            Admin Login
          </h1>
          <p className="mt-1 text-center text-sm text-zinc-600 sm:text-left">
            Sign in with the admin credentials from your .env.local
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="admin-email"
              className="text-xs font-medium text-zinc-700"
            >
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-zinc-400"
              onKeyDown={onEmailKeyDown}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="admin-password"
              className="text-xs font-medium text-zinc-700"
            >
              Password
            </label>
            <input
              ref={passwordInputRef}
              id="admin-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-zinc-400"
              placeholder="Enter admin password"
            />
          </div>

          <div className="pt-2">
            <StatefulButton
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Sign In
            </StatefulButton>
          </div>
        </div>
      </div>
    </div>
  );
}
