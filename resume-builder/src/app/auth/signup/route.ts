import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    const u = new URL("/signup", req.url);
    // Keep the message short; don't include sensitive data.
    u.searchParams.set("error", error.message.slice(0, 160));
    return NextResponse.redirect(u, { status: 303 });
  }
  return NextResponse.redirect(
    new URL("/login?signup=success", req.url),
    { status: 303 },
  );
}

