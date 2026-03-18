import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/adminAuth";
import { SignInForm } from "@/components/sign-in-form";

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
        <div className="mt-6">
          <SignInForm />
        </div>

        {sp.error ? (
          <p className="mt-4 text-sm text-red-700">{sp.error}</p>
        ) : null}
      </div>
    </div>
  );
}

