import { NextResponse } from "next/server";
import { setAdminSessionCookie, validateAdminCredentials } from "@/lib/adminAuth";

export async function GET(req: Request) {
  return NextResponse.redirect(new URL("/admin/login", req.url), {
    status: 307,
  });
}

export async function POST(req: Request) {
  const form = await req.formData();
  // Next/Node may type `req.formData()` with a FormData shape that doesn't include `.get`.
  // We only need simple string extraction from fields.
  const formAny = form as any;
  const email = String(formAny.get?.("email") ?? "");
  const password = String(formAny.get?.("password") ?? "");

  // #region agent log
  await fetch("http://127.0.0.1:7489/ingest/05527899-20a9-45e1-907b-6d2b6302efe8", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "973277" },
    body: JSON.stringify({
      sessionId: "973277",
      runId: "run4",
      hypothesisId: "H1",
      location: "src/app/admin/auth/login/route.ts:10",
      message: "Admin login POST received",
      data: { emailProvided: Boolean(email), passwordProvided: Boolean(password) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!email || !password) {
    return NextResponse.redirect(new URL("/admin/login?error=Missing+credentials", req.url), {
      status: 303,
    });
  }

  try {
    const ok = validateAdminCredentials({ email, password });
    // #region agent log
    await fetch("http://127.0.0.1:7489/ingest/05527899-20a9-45e1-907b-6d2b6302efe8", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "973277" },
      body: JSON.stringify({
        sessionId: "973277",
        runId: "run4",
        hypothesisId: "H2",
        location: "src/app/admin/auth/login/route.ts:24",
        message: "Admin credential validation finished",
        data: { ok, email },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    if (!ok) {
      return NextResponse.redirect(new URL("/admin/login?error=Invalid+credentials", req.url), {
        status: 303,
      });
    }
    await setAdminSessionCookie(email);
    // #region agent log
    await fetch("http://127.0.0.1:7489/ingest/05527899-20a9-45e1-907b-6d2b6302efe8", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "973277" },
      body: JSON.stringify({
        sessionId: "973277",
        runId: "run4",
        hypothesisId: "H3",
        location: "src/app/admin/auth/login/route.ts:39",
        message: "Admin session cookie set",
        data: { email },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return NextResponse.redirect(new URL("/admin", req.url), { status: 303 });
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=Admin+env+not+configured", req.url), {
      status: 303,
    });
  }
}

