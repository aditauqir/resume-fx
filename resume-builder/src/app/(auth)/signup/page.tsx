import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
    <div className="min-h-screen bg-zinc-50 px-6 py-16 flex flex-col items-center justify-center">
      <div className="-mt-[2.4rem] flex flex-col items-center">
        <Link href="/" className="mb-8">
          <Image
            src="/fix_my_resume_icon.svg"
            alt="ResumeFX"
            width={64}
            height={64}
            className="h-16 w-16"
          />
        </Link>
        <div className="w-full max-w-[30rem] sm:max-w-[37rem] md:max-w-[45rem]">
          <SignUpForm />
        </div>
      </div>

      {err ? (
        <AuthAlertDialog title="Sign up failed" description={err} />
      ) : null}
    </div>
  );
}

