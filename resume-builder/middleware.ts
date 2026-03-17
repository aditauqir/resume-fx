import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Edge runtime: avoid Node crypto. This cookie is NOT meant to be cryptographically verified here.
// We only gate navigation; all /api/admin routes are verified server-side.
function hasAdminCookie(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return false;
  const [payload] = token.split(".");
  if (!payload) return false;
  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const data = JSON.parse(json) as { exp?: number; email?: string };
    if (!data?.exp || Math.floor(Date.now() / 1000) > data.exp) return false;
    const adminEmail = process.env.ADMIN_LOGIN_EMAIL?.trim().toLowerCase();
    if (adminEmail && String(data.email ?? "").trim().toLowerCase() !== adminEmail)
      return false;
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    // Separate admin login (cookie-based) — no Supabase account required
    const ok = hasAdminCookie(req);

    if (pathname !== "/admin/login" && !pathname.startsWith("/admin/auth/")) {
      if (!ok) return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (pathname.startsWith("/app")) {
    if (!user) return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};

