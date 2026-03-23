import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { liveValidateKey, type Provider } from "@/lib/validateKey";

export async function POST(req: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { provider?: Provider; apiKey?: string }
    | null;

  const provider = body?.provider;
  const apiKey = body?.apiKey;

  if (!provider || !apiKey) {
    return NextResponse.json({ valid: false, error: "Missing provider or apiKey" }, { status: 400 });
  }

  const result = await liveValidateKey(provider, apiKey);
  return NextResponse.json(result, { status: result.valid ? 200 : 400 });
}

