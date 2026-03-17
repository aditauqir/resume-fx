import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/adminAuth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const session = await requireAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Admin login
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Sign in with the admin email + password from your <code>.env.local</code>.
        </p>

        <form className="mt-6 space-y-4" action="/admin/auth/login" method="post">
          <label className="block">
            <span className="text-xs font-medium text-zinc-700">Email</span>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              placeholder="admin@example.com"
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

        {sp.error ? (
          <p className="mt-4 text-sm text-red-700">{sp.error}</p>
        ) : null}
      </div>
    </div>
  );
}

