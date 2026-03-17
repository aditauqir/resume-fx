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
    .from("support_tickets")
    .select("id, user_email, subject, message, status, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Load failed" }, { status: 500 });
  return NextResponse.json(data ?? []);
}

