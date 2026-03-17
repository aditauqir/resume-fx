import { redirect } from "next/navigation";
import { getSupabaseServiceRoleClient } from "@/lib/supabase";
import { requireAdminSession } from "@/lib/adminAuth";
import { TemplateEditor } from "@/components/admin/TemplateEditor";
import { PromptChain, type PromptStep } from "@/components/admin/PromptChain";
import { KeywordsEditor } from "@/components/admin/KeywordsEditor";
import { TicketCenter, type Ticket } from "@/components/admin/TicketCenter";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const tab = sp.tab ?? "template";

  const admin = await requireAdminSession();
  if (!admin) redirect("/admin/login");

  const service = getSupabaseServiceRoleClient();

  const [
    { data: template },
    { data: prompts },
    { data: keywords },
    { data: tickets },
  ] = await Promise.all([
    service.from("admin_template").select("latex_code, updated_at").eq("id", 1).maybeSingle(),
    service
      .from("admin_prompts")
      .select("id, step_order, prompt_text, is_active")
      .order("step_order", { ascending: true }),
    service
      .from("admin_keywords")
      .select("keywords, updated_at")
      .eq("id", 1)
      .maybeSingle(),
    service
      .from("support_tickets")
      .select("id, user_email, subject, message, status, created_at")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Admin
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Template • Prompts • Keywords • Tickets
            </p>
          </div>
          <form action="/admin/auth/logout" method="post">
            <button className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800">
              Log out
            </button>
          </form>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-2">
          <div className="flex flex-wrap gap-2 p-2">
            <TabButton href="/admin?tab=template" active={tab === "template"}>
              Template
            </TabButton>
            <TabButton href="/admin?tab=prompts" active={tab === "prompts"}>
              Prompts
            </TabButton>
            <TabButton href="/admin?tab=keywords" active={tab === "keywords"}>
              Keywords
            </TabButton>
            <TabButton href="/admin?tab=tickets" active={tab === "tickets"}>
              Tickets
            </TabButton>
          </div>
          <div className="p-4">
            {tab === "template" ? (
              <TemplateEditor
                initialCode={template?.latex_code ?? ""}
                updatedAt={template?.updated_at ?? null}
              />
            ) : null}
            {tab === "prompts" ? (
              <PromptChain initialSteps={(prompts ?? []) as PromptStep[]} />
            ) : null}
            {tab === "keywords" ? (
              <KeywordsEditor
                initialKeywords={keywords?.keywords ?? ""}
                updatedAt={keywords?.updated_at ?? null}
              />
            ) : null}
            {tab === "tickets" ? (
              <TicketCenter initialTickets={(tickets ?? []) as Ticket[]} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-medium ${
        active ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-50"
      }`}
    >
      {children}
    </a>
  );
}

