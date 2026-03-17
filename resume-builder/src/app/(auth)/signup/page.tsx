import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";
import { SignUpForm } from "@/components/sign-up-form";
import { AuthAlertDialog } from "@/components/AuthAlertDialog";

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/app");

  const err = typeof sp.error === "string" ? sp.error : null;

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 flex items-center justify-center">
      <form
        action="/auth/signup"
        method="post"
        className="w-full max-w-md"
      >
        <SignUpForm />
      </form>

      {err ? (
        <AuthAlertDialog title="Sign up failed" description={err} />
      ) : null}
    </div>
  );
}

