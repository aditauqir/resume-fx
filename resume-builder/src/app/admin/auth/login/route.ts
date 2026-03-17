import { NextResponse } from "next/server";
import { setAdminSessionCookie, validateAdminCredentials } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  if (!email || !password) {
    return NextResponse.redirect(new URL("/admin/login?error=Missing+credentials", req.url), {
      status: 303,
    });
  }

  try {
    const ok = validateAdminCredentials({ email, password });
    if (!ok) {
      return NextResponse.redirect(new URL("/admin/login?error=Invalid+credentials", req.url), {
        status: 303,
      });
    }
    await setAdminSessionCookie(email);
    return NextResponse.redirect(new URL("/admin", req.url), { status: 303 });
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=Admin+env+not+configured", req.url), {
      status: 303,
    });
  }
}

