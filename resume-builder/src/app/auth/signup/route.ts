import { NextResponse } from "next/server";
import { getSupabaseServerClient, getSupabaseServiceRoleClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const formData = await req.formData();
  const formAny = formData as any;
  const email = String(formAny.get?.("email") ?? "");
  const password = String(formAny.get?.("password") ?? "");

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    const u = new URL("/signup", req.url);
    // Keep the message short; don't include sensitive data.
    u.searchParams.set("error", error.message.slice(0, 160));
    return NextResponse.redirect(u, { status: 303 });
  }

  const user = data.user;
  if (user) {
    const service = getSupabaseServiceRoleClient();
    const { error: profileError } = await service.from("profiles").upsert({
      id: user.id,
      email: user.email ?? email,
      uploads_left: 10,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      const u = new URL("/signup", req.url);
      u.searchParams.set("error", profileError.message.slice(0, 160));
      return NextResponse.redirect(u, { status: 303 });
    }
  }

  return NextResponse.redirect(
    new URL("/login?signup=success", req.url),
    { status: 303 },
  );
}

