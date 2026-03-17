import type { SupabaseClient } from "@supabase/supabase-js";

export async function checkDailyLimit(
  userId: string,
  supabase: SupabaseClient,
) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfDay.toISOString());

  return (count ?? 0) >= 1;
}

