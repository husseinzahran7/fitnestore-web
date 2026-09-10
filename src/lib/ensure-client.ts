"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Solo-mode provisioning: every trainee needs a clients row for logs,
 * even with no coach. Returns the client id, creating an active
 * coach-less row when missing. Needs the `clients owner insert` policy.
 */
export async function ensureMyClientId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string | null> {
  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("profile_id", userId)
    .single();
  if (existing?.id) return existing.id as string;
  const { data: created, error } = await supabase
    .from("clients")
    .insert({ profile_id: userId, status: "active" })
    .select("id")
    .single();
  if (error || !created) return null;
  return created.id as string;
}
