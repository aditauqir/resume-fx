import { NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase";
import { requireAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const service = getSupabaseServiceRoleClient();
    const { data, error } = await service
      .from("admin_keywords")
      .select("keywords, updated_at")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 },
      );
    }

    return NextResponse.json({
      keywords: data?.keywords ?? "",
      updated_at: data?.updated_at ?? null,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json().catch(() => null)) as
    | { keywords?: string }
    | null;
  const keywords = String(body?.keywords ?? "");

  try {
    const service = getSupabaseServiceRoleClient();
    const { error } = await service.from("admin_keywords").upsert({
      id: 1,
      keywords,
      updated_at: new Date().toISOString(),
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
