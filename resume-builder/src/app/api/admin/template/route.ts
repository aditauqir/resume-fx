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
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const service = getSupabaseServiceRoleClient();
  const { data, error } = await service
    .from("admin_template")
    .select("latex_code, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Load failed" }, { status: 500 });
  return NextResponse.json({
    latex_code: data?.latex_code ?? "",
    updated_at: data?.updated_at ?? null,
  });
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json().catch(() => null)) as
    | { latex_code?: string }
    | null;
  const latex_code = String(body?.latex_code ?? "");

  const service = getSupabaseServiceRoleClient();
  const { error } = await service
    .from("admin_template")
    .upsert({ id: 1, latex_code, updated_at: new Date().toISOString() });

  if (error) return NextResponse.json({ error: "Save failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

