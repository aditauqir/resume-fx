import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";
import { AuthAlertDialog } from "@/components/AuthAlertDialog";
import { SignInForm } from "@/components/sign-in-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ signup?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/app");

  const showSignupSuccess = sp.signup === "success";

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 flex items-center justify-center">
      <form
        action="/auth/login"
        method="post"
        className="w-full max-w-md"
      >
        <SignInForm />
      </form>

      {showSignupSuccess ? (
        <AuthAlertDialog
          title="Account created"
          description="You can now sign in with your email and password."
        />
      ) : null}
    </div>
  );
}

