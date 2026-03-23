import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const formData = await req.formData();
  const formAny = formData as any;
  const email = String(formAny.get?.("email") ?? "");
  const password = String(formAny.get?.("password") ?? "");

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.redirect(new URL(`/login`, req.url), { status: 303 });
  }
  return NextResponse.redirect(new URL("/app", req.url), { status: 303 });
}

