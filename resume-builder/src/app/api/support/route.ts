import { NextResponse } from "next/server";
import { getSupabaseServerClient, getSupabaseServiceRoleClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const body = (await req.json().catch(() => null)) as
    | { subject?: string; message?: string; user_email?: string }
    | null;

  const subject = String(body?.subject ?? "").trim();
  const message = String(body?.message ?? "").trim();
  const userEmail = user?.email ?? (body?.user_email ? String(body.user_email).trim() : null);

  // #region agent log
  await fetch("http://127.0.0.1:7489/ingest/05527899-20a9-45e1-907b-6d2b6302efe8", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "973277" },
    body: JSON.stringify({
      sessionId: "973277",
      runId: "run3",
      hypothesisId: "H1",
      location: "src/app/api/support/route.ts:18",
      message: "Support ticket request parsed",
      data: {
        hasUser: Boolean(user),
        subjectLength: subject.length,
        messageLength: message.length,
        hasFallbackEmail: Boolean(body?.user_email),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!subject || !message) {
    // #region agent log
    await fetch("http://127.0.0.1:7489/ingest/05527899-20a9-45e1-907b-6d2b6302efe8", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "973277" },
      body: JSON.stringify({
        sessionId: "973277",
        runId: "run3",
        hypothesisId: "H1",
        location: "src/app/api/support/route.ts:30",
        message: "Support ticket rejected for missing fields",
        data: { subjectEmpty: !subject, messageEmpty: !message },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return NextResponse.json({ error: "Missing subject or message" }, { status: 400 });
  }

  const service = getSupabaseServiceRoleClient();
  const { error } = await service.from("support_tickets").insert({
    user_id: user?.id ?? null,
    user_email: userEmail,
    subject,
    message,
    status: "open",
  });

  // #region agent log
  await fetch("http://127.0.0.1:7489/ingest/05527899-20a9-45e1-907b-6d2b6302efe8", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "973277" },
    body: JSON.stringify({
      sessionId: "973277",
      runId: "run3",
      hypothesisId: "H2",
      location: "src/app/api/support/route.ts:31",
      message: error ? "Support ticket insert failed" : "Support ticket insert succeeded",
      data: error
        ? { code: error.code ?? null, details: error.details ?? null, hint: error.hint ?? null }
        : { ok: true },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (error) {
    console.error("support_tickets insert failed", error);
    return NextResponse.json(
      {
        error: "Could not create ticket",
        detail: error.message,
        code: error.code ?? null,
        hint: error.hint ?? null,
      },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}

