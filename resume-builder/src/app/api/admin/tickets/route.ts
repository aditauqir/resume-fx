import { NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase";
import { requireAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const service = getSupabaseServiceRoleClient();
  const { data, error } = await service
    .from("support_tickets")
    .select("id, user_email, subject, message, status, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Load failed" }, { status: 500 });
  return NextResponse.json(data ?? []);
}

