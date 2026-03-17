import { NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase";
import { requireAdminSession } from "@/lib/adminAuth";

export async function GET() {
  try {
    const service = getSupabaseServiceRoleClient();
    const { data, error } = await service
      .from("admin_prompts")
      .select("id, step_order, prompt_text, is_active")
      .order("step_order", { ascending: true });
    if (error) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 },
      );
    }
    return NextResponse.json(data ?? []);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json().catch(() => null)) as
    | { prompt_text?: string }
    | null;
  const prompt_text = String(body?.prompt_text ?? "").trim();
  if (!prompt_text) {
    return NextResponse.json({ error: "Missing prompt_text" }, { status: 400 });
  }

  try {
    const service = getSupabaseServiceRoleClient();
    const { data: last, error: lastErr } = await service
      .from("admin_prompts")
      .select("step_order")
      .order("step_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lastErr) {
      return NextResponse.json(
        { error: lastErr.message, code: lastErr.code },
        { status: 500 },
      );
    }

    const nextOrder = Number(last?.step_order ?? 0) + 1;
    const { error } = await service.from("admin_prompts").insert({
      step_order: nextOrder,
      prompt_text,
      is_active: true,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}

