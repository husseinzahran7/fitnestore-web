"use server";

import { revalidatePath } from "next/cache";
import { createClient, getViewer } from "@/lib/supabase/server";
import { linkLive } from "@/lib/subscription-status";
import type { AppSub, CoachLink } from "@/lib/subscription-status";

export type { AppSub, CoachLink };

async function requireAdmin() {
  const viewer = await getViewer();
  if (!viewer || (viewer.role !== "admin" && viewer.role !== "superadmin")) {
    return { error: "Admins only." as const };
  }
  return { viewer };
}

/** Trainee's links (newest first), with names resolved for display. */
export async function getMyLinks(): Promise<CoachLink[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from("coach_links")
      .select("id, coach_id, trainee_id, client_id, weeks, status, share_history, payment_ref, starts_at, ends_at, created_at, coach_name, trainee_name")
      .eq("trainee_id", user.id)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    const coachIds = [...new Set(data.map((r) => r.coach_id))];
    const { data: profiles } = coachIds.length
      ? await supabase.from("profiles").select("id, name").in("id", coachIds)
      : { data: [] };
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return data.map((r) => ({
      ...r,
      status: r.status as CoachLink["status"],
      client_id: r.client_id as string | null,
      coach_name: (r.coach_name as string) || (names.get(r.coach_id) as string) || "Coach",
    }));
  } catch {
    return [];
  }
}

export async function getMyLiveLink(): Promise<CoachLink | null> {
  const links = await getMyLinks();
  return links.find((l) => linkLive(l)) ?? null;
}

export async function getMyAppSub(): Promise<AppSub | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("app_subs")
      .select("id, user_id, weeks, status, payment_ref, starts_at, ends_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("ends_at", { ascending: false })
      .limit(1)
      .single();
    if (!data) return null;
    if (data.ends_at && new Date(data.ends_at).getTime() < Date.now()) return null;
    return { ...data, status: data.status as AppSub["status"] };
  } catch {
    return null;
  }
}

/** Coach view: trainees linked to me. */
export async function getCoachLinks(): Promise<CoachLink[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from("coach_links")
      .select("id, coach_id, trainee_id, client_id, weeks, status, share_history, payment_ref, starts_at, ends_at, created_at, coach_name, trainee_name")
      .eq("coach_id", user.id)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    const traineeIds = [...new Set(data.map((r) => r.trainee_id))];
    const { data: profiles } = traineeIds.length
      ? await supabase.from("profiles").select("id, name").in("id", traineeIds)
      : { data: [] };
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return data.map((r) => ({
      ...r,
      status: r.status as CoachLink["status"],
      client_id: r.client_id as string | null,
      trainee_name: (r.trainee_name as string) || (names.get(r.trainee_id) as string) || "Trainee",
    }));
  } catch {
    return [];
  }
}

export async function listAllLinks(): Promise<CoachLink[]> {
  try {
    const gate = await requireAdmin();
    if ("error" in gate) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coach_links")
      .select("id, coach_id, trainee_id, client_id, weeks, status, share_history, payment_ref, starts_at, ends_at, created_at, coach_name, trainee_name")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error || !data) return [];
    const ids = [...new Set([...data.map((r) => r.coach_id), ...data.map((r) => r.trainee_id)])];
    const { data: profiles } = ids.length
      ? await supabase.from("profiles").select("id, name").in("id", ids)
      : { data: [] };
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return data.map((r) => ({
      ...r,
      status: r.status as CoachLink["status"],
      client_id: r.client_id as string | null,
      coach_name: (r.coach_name as string) || (names.get(r.coach_id) as string) || "Coach",
      trainee_name: (r.trainee_name as string) || (names.get(r.trainee_id) as string) || "Trainee",
    }));
  } catch {
    return [];
  }
}

export async function listAllAppSubs(): Promise<AppSub[]> {
  try {
    const gate = await requireAdmin();
    if ("error" in gate) return [];
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("app_subs")
      .select("id, user_id, weeks, status, payment_ref, starts_at, ends_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error || !data) return [];
    const { data: profiles } = data.length
      ? await supabase.from("profiles").select("id, name").in("id", data.map((r) => r.user_id))
      : { data: [] };
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));
    return data.map((r) => ({
      ...r,
      status: r.status as AppSub["status"],
      user_name: (names.get(r.user_id) as string) ?? "Member",
    }));
  } catch {
    return [];
  }
}

export type SubState = { error?: string; ok?: boolean };

function parseWeeks(v: FormDataEntryValue | null): number | null {
  const n = parseInt(String(v ?? ""), 10);
  if (!Number.isFinite(n) || n < 1 || n > 52) return null;
  return n;
}

async function profileName(
  supabase: Awaited<ReturnType<typeof createClient>>,
  id: string
): Promise<string> {
  try {
    const { data } = await supabase.rpc("profile_name", { p_id: id });
    return String(data ?? "");
  } catch {
    return "";
  }
}

async function resolveViaHelper(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: string
): Promise<string | null> {
  const q = input.trim();
  if (!q) return null;
  try {
    const { data } = await supabase.rpc("find_profile_id", { p_input: q });
    return (data as string) ?? null;
  } catch {
    return null;
  }
}

export async function resolveProfileId(supabase: Awaited<ReturnType<typeof createClient>>, input: string): Promise<string | null> {
  const q = input.trim();
  if (!q) return null;
  // UUID direct
  if (/^[0-9a-f-]{32,36}$/i.test(q)) {
    const { data } = await supabase.from("profiles").select("id").eq("id", q).single();
    if (data?.id) return data.id as string;
    // Row hidden by profiles RLS (e.g. coach resolving a trainee) — definer fallback.
    return resolveViaHelper(supabase, q);
  }
  // profiles has no email; match by name, then definer fallback for RLS-hidden rows.
  const { data } = await supabase.from("profiles").select("id").ilike("name", q).limit(1).single();
  return (data?.id as string) ?? resolveViaHelper(supabase, q);
}

/** Admin: activate link after offline coach payment. Creates client row if missing. */
export async function activateLink(_prev: SubState, formData: FormData): Promise<SubState> {
  const gate = await requireAdmin();
  if ("error" in gate) return { error: gate.error };
  const weeks = parseWeeks(formData.get("weeks"));
  const traineeInput = String(formData.get("trainee") ?? "");
  const coachInput = String(formData.get("coach") ?? "");
  const paymentRef = String(formData.get("paymentRef") ?? "").trim().slice(0, 200);
  if (!weeks) return { error: "Weeks must be 1–52." };
  if (!traineeInput || !coachInput) return { error: "Trainee and coach are required." };

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet." };
  }
  const traineeId = await resolveProfileId(supabase, traineeInput);
  const coachId = await resolveProfileId(supabase, coachInput);
  if (!traineeId) return { error: "Trainee not found — paste their user ID from Admin → Users." };
  if (!coachId) return { error: "Coach not found — paste their user ID." };
  if (traineeId === coachId) return { error: "Coach and trainee can't be the same." };

  // Ensure client row exists for FK + progress tables.
  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("profile_id", traineeId)
    .single();
  let clientId: string | null = (existingClient?.id as string) ?? null;
  if (!clientId) {
    const { data: created, error: cErr } = await supabase
      .from("clients")
      .insert({ profile_id: traineeId, coach_id: coachId, status: "pending" })
      .select("id")
      .single();
    if (cErr || !created) return { error: "Couldn't create client record." };
    clientId = created.id;
  } else {
    await supabase.from("clients").update({ coach_id: coachId }).eq("id", clientId);
  }

  // A coach-invited pending row converts to active instead of inserting a duplicate.
  const { data: pending } = await supabase
    .from("coach_links")
    .select("id")
    .eq("coach_id", coachId)
    .eq("trainee_id", traineeId)
    .eq("status", "pending")
    .single();
  if (pending?.id) {
    const [cName, tName] = await Promise.all([
      profileName(supabase, coachId),
      profileName(supabase, traineeId),
    ]);
    const { error } = await supabase
      .from("coach_links")
      .update({
        client_id: clientId,
        weeks,
        status: "active",
        payment_ref: paymentRef,
        coach_name: cName,
        trainee_name: tName,
        activated_by: gate.viewer.id,
        activated_at: new Date().toISOString(),
      })
      .eq("id", pending.id);
    if (error) return { error: "Couldn't activate. Try again." };
    revalidatePath("/admin/subscriptions");
    revalidatePath("/coach/clients");
    return { ok: true };
  }

  const [cName, tName] = await Promise.all([
    profileName(supabase, coachId),
    profileName(supabase, traineeId),
  ]);
  const { error } = await supabase.from("coach_links").insert({
    coach_id: coachId,
    trainee_id: traineeId,
    client_id: clientId,
    weeks,
    status: "active",
    payment_ref: paymentRef,
    coach_name: cName,
    trainee_name: tName,
    requested_by: gate.viewer.id,
    activated_by: gate.viewer.id,
    activated_at: new Date().toISOString(),
    // starts_at stays NULL until coach sends first plan (clock starts on send).
  });
  if (error) {
    if (error.message.includes("coach_links_one_open_per_pair")) {
      return { error: "An open link already exists for this pair." };
    }
    return { error: "Couldn't activate. Try again." };
  }
  revalidatePath("/admin/subscriptions");
  revalidatePath("/coach/clients");
  return { ok: true };
}

/** Admin: one-click activate for a coach-invited pending link (weeks adjustable). */
export async function activatePendingLink(_prev: SubState, formData: FormData): Promise<SubState> {
  const gate = await requireAdmin();
  if ("error" in gate) return { error: gate.error };
  const id = String(formData.get("id") ?? "");
  const weeks = parseWeeks(formData.get("weeks")) ?? 4;
  if (!id) return { error: "Invalid request." };
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet." };
  }
  const { data: link } = await supabase
    .from("coach_links")
    .select("id, coach_id, trainee_id, status")
    .eq("id", id)
    .eq("status", "pending")
    .single();
  if (!link) return { error: "Pending request not found." };

  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("profile_id", link.trainee_id)
    .single();
  let clientId: string | null = (existingClient?.id as string) ?? null;
  if (!clientId) {
    const { data: created, error: cErr } = await supabase
      .from("clients")
      .insert({ profile_id: link.trainee_id, coach_id: link.coach_id, status: "pending" })
      .select("id")
      .single();
    if (cErr || !created) return { error: "Couldn't create client record." };
    clientId = created.id;
  } else {
    await supabase.from("clients").update({ coach_id: link.coach_id }).eq("id", clientId);
  }

  const { error } = await supabase
    .from("coach_links")
    .update({
      client_id: clientId,
      weeks,
      status: "active",
      coach_name: await profileName(supabase, link.coach_id),
      trainee_name: await profileName(supabase, link.trainee_id),
      activated_by: gate.viewer.id,
      activated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: "Couldn't activate. Try again." };
  revalidatePath("/admin/subscriptions");
  revalidatePath("/coach/clients");
  return { ok: true };
}

/** Coach: invite a trainee by user ID (or exact name). Admin activates after offline pay. */
export async function inviteTrainee(_prev: SubState, formData: FormData): Promise<SubState> {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "coach") return { error: "Coaches only." };
  const weeks = parseWeeks(formData.get("weeks")) ?? 4;
  const traineeInput = String(formData.get("trainee") ?? "").trim();
  if (!traineeInput) return { error: "Trainee user ID is required." };
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet." };
  }
  const traineeId = await resolveProfileId(supabase, traineeInput);
  if (!traineeId) return { error: "Trainee not found — ask them for their user ID (Settings page)." };
  if (traineeId === viewer.id) return { error: "You can't invite yourself." };
  const { error } = await supabase.from("coach_links").insert({
    coach_id: viewer.id,
    trainee_id: traineeId,
    weeks,
    status: "pending",
    coach_name: viewer.name,
    trainee_name: await profileName(supabase, traineeId),
    requested_by: viewer.id,
  });
  if (error) {
    if (error.message.includes("coach_links_one_open_per_pair")) {
      return { error: "An open request already exists for this trainee." };
    }
    return { error: "Couldn't send invite. Try again." };
  }
  revalidatePath("/coach/clients");
  return { ok: true };
}

export async function setLinkStatus(_prev: SubState, formData: FormData): Promise<SubState> {
  const gate = await requireAdmin();
  if ("error" in gate) return { error: gate.error };
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["expired", "revoked", "active"].includes(status)) return { error: "Invalid request." };
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet." };
  }
  const { error } = await supabase.from("coach_links").update({ status }).eq("id", id);
  if (error) return { error: "Couldn't save. Try again." };
  revalidatePath("/admin/subscriptions");
  return { ok: true };
}

/** Coach: start clock on first send. sets starts_at=now, ends_at=now+weeks*7d. */
export async function startLinkClock(linkId: string): Promise<{ started: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { started: false, error: "Signed out." };
    const { data: link } = await supabase
      .from("coach_links")
      .select("id, weeks, status, starts_at")
      .eq("id", linkId)
      .eq("coach_id", user.id)
      .single();
    if (!link || link.status !== "active" || link.starts_at) return { started: false };
    const weeks = Math.min(52, Math.max(1, Number(link.weeks ?? 4)));
    const starts = new Date();
    const ends = new Date(starts.getTime() + weeks * 7 * 24 * 3600 * 1000);
    const { error } = await supabase
      .from("coach_links")
      .update({ starts_at: starts.toISOString(), ends_at: ends.toISOString() })
      .eq("id", linkId)
      .is("starts_at", null);
    if (error) return { started: false, error: "Couldn't start clock." };
    return { started: true };
  } catch {
    return { started: false, error: "Supabase not connected." };
  }
}

/** Coach: may I send to this client? Active (started or not-yet-started) link,
 * or no link rows at all (legacy grace). Expired/revoked-only → blocked. */
export async function coachMaySend(clientId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !clientId) return { ok: false, error: "You're signed out. Sign in again." };
    const { data: client } = await supabase
      .from("clients")
      .select("id, coach_id, profile_id")
      .eq("id", clientId)
      .single();
    if (!client) return { ok: false, error: "Client not found." };
    const viewer = await getViewer();
    const admin = !!viewer && (viewer.role === "admin" || viewer.role === "superadmin");
    if (!admin && client.coach_id !== user.id) return { ok: false, error: "Not your client." };
    if (admin) return { ok: true };
    const { data: links } = await supabase
      .from("coach_links")
      .select("status, starts_at, ends_at")
      .eq("coach_id", user.id)
      .eq("trainee_id", client.profile_id);
    if (!links || links.length === 0) return { ok: true }; // legacy grace
    const now = Date.now();
    const writable = links.some(
      (l) =>
        l.status === "active" &&
        (!l.starts_at || !l.ends_at || new Date(l.ends_at).getTime() >= now)
    );
    if (!writable) {
      return { ok: false, error: "Subscription expired — ask admin to renew this trainee." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Supabase not connected." };
  }
}

/** Coach: start clock for whichever open link matches this client (call after each send). */export async function startClockForClientId(clientId: string): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !clientId) return;
    const { data: link } = await supabase
      .from("coach_links")
      .select("id, weeks")
      .eq("coach_id", user.id)
      .eq("client_id", clientId)
      .eq("status", "active")
      .is("starts_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (!link) return;
    await startLinkClock(link.id);
  } catch {
    // best-effort; send itself already succeeded
  }
}

/** Admin: sweep expired. */
export async function expireDue(): Promise<SubState> {
  const gate = await requireAdmin();
  if ("error" in gate) return { error: gate.error };
  try {
    const supabase = await createClient();
    await supabase.rpc("expire_due_links");
  } catch {
    return { error: "Couldn't expire. Try again." };
  }
  revalidatePath("/admin/subscriptions");
  return { ok: true };
}

/** Admin: activate read-only app sub (unlock old plans, no coach tracking). */
export async function activateAppSub(_prev: SubState, formData: FormData): Promise<SubState> {
  const gate = await requireAdmin();
  if ("error" in gate) return { error: gate.error };
  const weeks = parseWeeks(formData.get("weeks"));
  const userInput = String(formData.get("user") ?? "");
  const paymentRef = String(formData.get("paymentRef") ?? "").trim().slice(0, 200);
  if (!weeks) return { error: "Weeks must be 1–52." };
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet." };
  }
  const userId = await resolveProfileId(supabase, userInput);
  if (!userId) return { error: "User not found — paste their user ID." };
  const starts = new Date();
  const ends = new Date(starts.getTime() + weeks * 7 * 24 * 3600 * 1000);
  const { error } = await supabase.from("app_subs").insert({
    user_id: userId,
    weeks,
    status: "active",
    payment_ref: paymentRef,
    activated_by: gate.viewer.id,
    activated_at: starts.toISOString(),
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
  });
  if (error) return { error: "Couldn't activate. Try again." };
  revalidatePath("/admin/subscriptions");
  return { ok: true };
}
