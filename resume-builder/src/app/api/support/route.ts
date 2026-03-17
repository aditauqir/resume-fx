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

  if (!subject || !message) {
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

  if (error) return NextResponse.json({ error: "Could not create ticket" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

