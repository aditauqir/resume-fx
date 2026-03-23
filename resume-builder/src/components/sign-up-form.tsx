"use client";

import Link from "next/link";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox-web";
import { PasswordStrength } from "@/components/ui/password-strength";
import { StatefulButton } from "@/components/ui/stateful-button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignUpForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const passwordInputRef = React.useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement | null>(null);

  function onEmailKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  }

  function onPasswordKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmPasswordRef.current?.focus();
    }
  }

  const validateForm = (): string | null => {
    if (!email) return "Email is required";
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    if (!acceptTerms) return "You must accept the Terms and Conditions";
    if (!acceptPrivacy) return "You must accept the Privacy Policy";
    return null;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await fetch("/auth/signup", {
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
        throw new Error(data?.error ?? "Sign up failed");
      }

      window.location.href = "/login?signup=success";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gap-6 font-[Arial,Helvetica,sans-serif]">
      <div className="rounded-lg bg-white px-6 py-6 sm:px-8">
        <div className="mb-6">
          <h1 className="text-center text-xl font-semibold tracking-tight text-zinc-950 sm:text-left">
            Create your account
          </h1>
          <p className="mt-1 text-center text-sm text-zinc-600 sm:text-left">
            It is time to lock in. Enter the required details to get started.
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
              htmlFor="email"
              className="text-xs font-medium text-zinc-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="baller@hotmail.com"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-zinc-400"
              onKeyDown={onEmailKeyDown}
            />
          </div>

          <div className="space-y-1">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-zinc-400"
              placeholder="At least 8 characters"
              onKeyDown={onPasswordKeyDown}
            />
            <PasswordStrength password={password} />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="confirm-password"
              className="text-xs font-medium text-zinc-700"
            >
              Retype Password
            </label>
            <input
              ref={confirmPasswordRef}
              id="confirm-password"
              name="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none focus:border-zinc-400"
              placeholder="Retype your password"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
              />
              <label
                htmlFor="terms"
                className="text-sm text-zinc-600 cursor-pointer"
              >
                I accept the{" "}
                <Link href="/#terms-conditions" className="underline underline-offset-2">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="privacy"
                checked={acceptPrivacy}
                onCheckedChange={setAcceptPrivacy}
              />
              <label
                htmlFor="privacy"
                className="text-sm text-zinc-600 cursor-pointer"
              >
                I accept the{" "}
                <Link href="/#privacy-policy" className="underline underline-offset-2">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <StatefulButton
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Create Account
            </StatefulButton>
          </div>
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
      </div>
    </div>
  );
}
