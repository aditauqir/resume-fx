import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function timingSafeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function sign(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export type AdminSession = { email: string; exp: number };

export function createAdminSession(email: string): string {
  const secret = env("ADMIN_SESSION_SECRET");
  const ttlSeconds = Number(process.env.ADMIN_SESSION_TTL_SECONDS ?? 60 * 60 * 8); // 8h
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const session: AdminSession = { email, exp };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const sig = sign(payload, secret);
  return `${payload}.${sig}`;
}

export function readAdminSession(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload, secret);
  if (!timingSafeEqual(sig, expected)) return null;
  const json = Buffer.from(payload, "base64url").toString("utf8");
  const parsed = JSON.parse(json) as AdminSession;
  if (!parsed?.email || typeof parsed.exp !== "number") return null;
  if (Math.floor(Date.now() / 1000) > parsed.exp) return null;
  return parsed;
}

export async function requireAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  const session = readAdminSession(token);
  if (!session) return null;
  // Optional: match email to env to allow rotation
  const adminEmail = process.env.ADMIN_LOGIN_EMAIL;
  if (adminEmail && session.email !== adminEmail) return null;
  return session;
}

export async function setAdminSessionCookie(email: string) {
  const jar = await cookies();
  const token = createAdminSession(email);
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function clearAdminSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
}

export function validateAdminCredentials(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const okEmail = env("ADMIN_LOGIN_EMAIL").trim().toLowerCase();
  const okPass = env("ADMIN_LOGIN_PASSWORD");
  return timingSafeEqual(email, okEmail) && timingSafeEqual(password, okPass);
}

