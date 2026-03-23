import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { requireAdminSession } from "@/lib/adminAuth";
import { AdminSignInForm } from "@/components/admin-sign-in-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const session = await requireAdminSession();
  if (session) redirect("/admin");

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
          <AdminSignInForm serverError={err} />
        </div>
      </div>
    </div>
  );
}

