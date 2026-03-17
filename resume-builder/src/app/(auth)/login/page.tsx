import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";

export default async function LoginPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/app");

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Log in
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Use your Supabase auth email + password.
        </p>

        <form className="mt-6 space-y-4" action="/auth/login" method="post">
          <label className="block">
            <span className="text-xs font-medium text-zinc-700">Email</span>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-700">Password</span>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              placeholder="••••••••"
            />
          </label>
          <button className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800">
            Continue
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-600">
          Need an account?{" "}
          <Link href="/signup" className="font-medium text-zinc-950 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

