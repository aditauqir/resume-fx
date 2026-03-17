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
    | { status?: "open" | "in_progress" | "resolved" }
    | null;
  const status = body?.status;
  if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });

  const service = getSupabaseServiceRoleClient();
  const { error } = await service
    .from("support_tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

