import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";
import { checkDailyLimit } from "@/lib/rateLimit";
import { UploadForm } from "@/components/UploadForm";

export default async function AppPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const alreadyUsedToday = await checkDailyLimit(user.id, supabase);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Resume Builder
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Upload your resume, choose a provider, and download a polished
              output.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
            >
              Admin
            </Link>
            <form action="/auth/logout" method="post">
              <button className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800">
                Log out
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8">
          <UploadForm alreadyUsedToday={alreadyUsedToday} />
        </div>
      </div>
    </div>
  );
}

