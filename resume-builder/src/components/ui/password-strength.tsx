"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { score, label: "Weak", color: "bg-red-500" };
  } else if (score <= 4) {
    return { score, label: "Fair", color: "bg-yellow-500" };
  } else {
    return { score, label: "Strong", color: "bg-green-500" };
  }
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const { score, label, color } = getPasswordStrength(password);
  const maxScore = 6;
  const percentage = (score / maxScore) * 100;

  if (!password) return null;

  return (
    <div className={cn("mt-2 space-y-1 font-[Arial,Helvetica,sans-serif]", className)}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className={cn("h-full transition-all duration-300", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className={cn("text-xs", {
        "text-red-600": label === "Weak",
        "text-yellow-600": label === "Fair",
        "text-green-600": label === "Strong",
      })}>
        Password strength: {label}
      </p>
    </div>
  );
}
