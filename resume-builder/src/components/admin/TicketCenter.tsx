"use client";

import { useMemo, useState } from "react";

export type Ticket = {
  id: string;
  user_email: string | null;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  created_at: string;
};

type Props = {
  initialTickets: Ticket[];
};

export function TicketCenter({ initialTickets }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [filter, setFilter] = useState<"all" | Ticket["status"]>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return tickets;
    return tickets.filter((t) => t.status === filter);
  }, [tickets, filter]);

  const counts = useMemo(() => {
    const unresolved = tickets.filter((t) => t.status !== "resolved").length;
    return { unresolved };
  }, [tickets]);

  async function reload() {
    const res = await fetch("/api/admin/tickets");
    const data = (await res.json()) as Ticket[];
    setTickets(data);
  }

  async function setStatus(id: string, status: Ticket["status"]) {
    await fetch(`/api/admin/tickets/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-zinc-950">Tickets</p>
          <p className="mt-1 text-xs text-zinc-600">
            Unresolved: {counts.unresolved}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "open", "in_progress", "resolved"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                filter === f
                  ? "bg-zinc-950 text-white"
                  : "border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50"
              }`}
            >
              {f === "all"
                ? "All"
                : f === "open"
                  ? "Open"
                  : f === "in_progress"
                    ? "In Progress"
                    : "Resolved"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <details
            key={t.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4"
          >
            <summary className="cursor-pointer list-none">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-950">{t.subject}</p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {t.user_email ?? "—"} •{" "}
                    {new Date(t.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={t.status}
                    onChange={(e) =>
                      setStatus(t.id, e.target.value as Ticket["status"])
                    }
                    className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-400"
                  >
                    <option value="open">open</option>
                    <option value="in_progress">in_progress</option>
                    <option value="resolved">resolved</option>
                  </select>
                </div>
              </div>
            </summary>

            <div className="mt-4 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900">
              {t.message}
            </div>
          </details>
        ))}
        {!filtered.length ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            No tickets.
          </div>
        ) : null}
      </div>
    </div>
  );
}

