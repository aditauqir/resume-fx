import { NextResponse } from "next/server";
import { getSupabaseServerClient, getSupabaseServiceRoleClient } from "@/lib/supabase";

async function requireAdmin() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) return null;
  return user;
}

export async function GET() {
  const service = getSupabaseServiceRoleClient();
  const { data, error } = await service
    .from("admin_prompts")
    .select("id, step_order, prompt_text, is_active")
    .order("step_order", { ascending: true });
  if (error) return NextResponse.json({ error: "Load failed" }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json().catch(() => null)) as
    | { prompt_text?: string }
    | null;
  const prompt_text = String(body?.prompt_text ?? "").trim();
  if (!prompt_text) {
    return NextResponse.json({ error: "Missing prompt_text" }, { status: 400 });
  }

  const service = getSupabaseServiceRoleClient();
  const { data: last } = await service
    .from("admin_prompts")
    .select("step_order")
    .order("step_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = Number(last?.step_order ?? 0) + 1;
  const { error } = await service.from("admin_prompts").insert({
    step_order: nextOrder,
    prompt_text,
    is_active: true,
  });

  if (error) return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

