import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";
import { requireAdminSession } from "@/lib/adminAuth";
import { UploadForm } from "@/components/UploadForm";
import { AppNavbar } from "@/components/app/AppNavbar";

export default async function AppPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const adminSession = await requireAdminSession();
  // #region agent log
  await fetch("http://127.0.0.1:7489/ingest/05527899-20a9-45e1-907b-6d2b6302efe8", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "973277" },
    body: JSON.stringify({
      sessionId: "973277",
      runId: "run2",
      hypothesisId: "H2",
      location: "src/app/app/page.tsx:15",
      message: "App page render",
      data: { userEmail: user.email ?? null, adminSession: Boolean(adminSession) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  const { data: profile } = await supabase
    .from("profiles")
    .select("uploads_left")
    .eq("id", user.id)
    .maybeSingle();
  const uploadsLeft = Number(profile?.uploads_left ?? 10);

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground">
      <AppNavbar userEmail={user.email ?? null} />

      <div className="mx-auto max-w-3xl">
        <div className="mt-4">
          <UploadForm initialUploadsLeft={uploadsLeft} />
        </div>
      </div>
    </div>
  );
}

