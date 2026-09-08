"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  MeasurementPoint,
  ProgressPhoto,
  StrengthPoint,
  WeightPoint,
} from "@/data/userProgress";
import type { Client as ProgressClient } from "@/data/progress/types";

async function myClientId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("clients")
    .select("id")
    .eq("profile_id", userId)
    .single();
  return data?.id ?? null;
}

export interface UserProgressData {
  weight: WeightPoint[];
  strength: StrengthPoint[];
  measurements: MeasurementPoint[];
  // No backend photos yet (storage bucket exists, zero objects) — always [].
  photos: ProgressPhoto[];
  photosLive: LivePhoto[];
}

export interface LivePhoto {
  name: string;
  url: string;
}

export async function getUserProgress(): Promise<{
  data: UserProgressData;
  live: boolean;
}> {
  const empty: UserProgressData = {
    weight: [],
    strength: [],
    measurements: [],
    photos: [],
    photosLive: [],
  };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: empty, live: false };
    const clientId = await myClientId(supabase, user.id);
    if (!clientId) return { data: empty, live: false };

    const [{ data: body }, { data: perf }] = await Promise.all([
      supabase
        .from("body_metrics")
        .select("measured_on, weight, body_fat, chest, waist, arms")
        .eq("client_id", clientId)
        .order("measured_on", { ascending: true }),
      supabase
        .from("performance_metrics")
        .select("measured_on, metric, value")
        .eq("client_id", clientId)
        .order("measured_on", { ascending: true }),
    ]);
    if ((!body || body.length === 0) && (!perf || perf.length === 0)) {
      return { data: empty, live: false };
    }

    const weight: WeightPoint[] = (body ?? [])
      .filter((b) => b.weight != null)
      .map((b) => ({ date: String(b.measured_on), weight: Number(b.weight) }));

    const measurements: MeasurementPoint[] = (body ?? [])
      .filter((b) => b.chest != null && b.waist != null && b.arms != null)
      .map((b) => ({
        date: String(b.measured_on),
        chest: Number(b.chest),
        waist: Number(b.waist),
        arms: Number(b.arms),
      }));

    // Pivot squat/bench/deadlift by date; drop incomplete dates (no zero-fill).
    type Pivot = { date: string; squat?: number; bench?: number; deadlift?: number };
    const byDate = new Map<string, Pivot>();
    for (const p of perf ?? []) {
      const m = String(p.metric) as "squat" | "bench" | "deadlift";
      if (m !== "squat" && m !== "bench" && m !== "deadlift") continue;
      const key = String(p.measured_on);
      const row = byDate.get(key) ?? { date: key };
      row[m] = Number(p.value);
      byDate.set(key, row);
    }
    const strength: StrengthPoint[] = [...byDate.values()].filter(
      (r): r is StrengthPoint =>
        r.squat != null && r.bench != null && r.deadlift != null
    );

    const photosLive = await listLivePhotos(supabase, user.id);
    return { data: { weight, strength, measurements, photos: [], photosLive }, live: true };
  } catch {
    return { data: empty, live: false };
  }
}

async function listLivePhotos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<LivePhoto[]> {
  try {
    const { data: files } = await supabase.storage
      .from("progress_photos")
      .list(userId, { limit: 24, sortBy: { column: "created_at", order: "desc" } });
    if (!files || files.length === 0) return [];
    const paths = files
      .filter((f) => f.id != null)
      .map((f) => `${userId}/${f.name}`);
    if (paths.length === 0) return [];
    const { data: signed } = await supabase.storage
      .from("progress_photos")
      .createSignedUrls(paths, 60 * 60 * 24 * 7);
    return (signed ?? [])
      .filter((s) => s.signedUrl && s.path)
      .map((s) => ({
        name: (s.path as string).split("/").pop() ?? (s.path as string),
        url: s.signedUrl as string,
      }));
  } catch {
    return [];
  }
}

export async function getCoachProgress(): Promise<{
  clients: ProgressClient[];
  live: boolean;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { clients: [], live: false };

    const { data: rows, error } = await supabase
      .from("clients")
      .select("id, plan, status, goals, progress, profile_id")
      .eq("coach_id", user.id)
      .order("created_at", { ascending: false });
    if (error || !rows || rows.length === 0) {
      return { clients: [], live: false };
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name")
      .in(
        "id",
        rows.map((r) => r.profile_id)
      );
    const names = new Map((profiles ?? []).map((p) => [p.id, p.name]));

    const clientIds = rows.map((r) => r.id);
    const [{ data: body }, { data: perf }] = await Promise.all([
      supabase
        .from("body_metrics")
        .select("client_id, measured_on, weight, body_fat")
        .in("client_id", clientIds)
        .order("measured_on", { ascending: true }),
      supabase
        .from("performance_metrics")
        .select("client_id, measured_on, metric, value")
        .in("client_id", clientIds)
        .order("measured_on", { ascending: true }),
    ]);

    const clients: ProgressClient[] = rows.map((r) => {
      const own = (metric: string) =>
        (perf ?? [])
          .filter((p) => p.client_id === r.id && p.metric === metric)
          .map((p) => ({
            date: String(p.measured_on),
            value: Number(p.value),
          }));
      return {
        id: r.id,
        name: (names.get(r.profile_id) as string) ?? "Client",
        email: "",
        plan: r.plan,
        isActive: r.status === "active",
        goals: r.goals ? [r.goals as string] : [],
        progress: (r.progress as number | null) ?? 0,
        metrics: {
          weight: (body ?? [])
            .filter((b) => b.client_id === r.id && b.weight != null)
            .map((b) => ({
              date: String(b.measured_on),
              value: Number(b.weight),
            })),
          bodyFat: (body ?? [])
            .filter((b) => b.client_id === r.id && b.body_fat != null)
            .map((b) => ({
              date: String(b.measured_on),
              value: Number(b.body_fat),
            })),
          strength: own("strength"),
          endurance: own("endurance"),
        },
        // No check-ins table exists — honestly empty, not fabricated.
        checkIns: [],
      };
    });
    return { clients, live: true };
  } catch {
    return { clients: [], live: false };
  }
}
