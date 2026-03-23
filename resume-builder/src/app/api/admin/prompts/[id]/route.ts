import { NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase";
import { requireAdminSession } from "@/lib/adminAuth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as
    | { prompt_text?: string; step_order?: number; is_active?: boolean }
    | null;

  const patch: Record<string, unknown> = {};
  if (typeof body?.prompt_text === "string") patch.prompt_text = body.prompt_text;
  if (typeof body?.step_order === "number") patch.step_order = body.step_order;
  if (typeof body?.is_active === "boolean") patch.is_active = body.is_active;
  patch.updated_at = new Date().toISOString();

  const service = getSupabaseServiceRoleClient();
  const { error } = await service.from("admin_prompts").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const service = getSupabaseServiceRoleClient();
  const { error } = await service.from("admin_prompts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

