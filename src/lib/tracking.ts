"use server";

import { createClient } from "@/lib/supabase/server";

export interface TrackExercise {
  id: string;
  name: string;
  plannedSets: number;
  prefill: Array<{ weight: string; reps: string; warmup: boolean }>;
}

export interface TrackHistory {
  id: string;
  performedOn: string;
}

export interface CoachLogView {
  id: string;
  title: string;
  performedOn: string;
  sets: Array<{
    exercise: string;
    setNo: number;
    warmup: boolean;
    weight: string;
    reps: string;
  }>;
}

export async function getClientLogs(clientId: string): Promise<{
  clientName: string;
  logs: CoachLogView[];
  live: boolean;
}> {
  const fallback = { clientName: "", logs: [], live: false };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fallback;

    // Ownership enforced again here; RLS is the real gate.
    const { data: client } = await supabase
      .from("clients")
      .select("id, profile_id")
      .eq("id", clientId)
      .eq("coach_id", user.id)
      .single();
    if (!client) return fallback;

    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", client.profile_id)
      .single();

    const { data: logs } = await supabase
      .from("workout_logs")
      .select("id, title, performed_on")
      .eq("client_id", clientId)
      .order("performed_on", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20);
    if (!logs || logs.length === 0) {
      return {
        clientName: (profile?.name as string) ?? "Client",
        logs: [],
        live: true,
      };
    }

    const { data: sets } = await supabase
      .from("set_logs")
      .select("log_id, exercise_id, set_no, is_warmup, weight, reps")
      .in(
        "log_id",
        logs.map((l) => l.id)
      )
      .order("set_no", { ascending: true });

    const exIds = [...new Set((sets ?? []).map((s) => s.exercise_id))];
    const { data: exercises } = exIds.length
      ? await supabase.from("exercises").select("id, name").in("id", exIds)
      : { data: [] };
    const names = new Map((exercises ?? []).map((e) => [e.id, e.name]));

    return {
      clientName: (profile?.name as string) ?? "Client",
      logs: logs.map((l) => ({
        id: l.id,
        title: l.title,
        performedOn: String(l.performed_on),
        sets: (sets ?? [])
          .filter((s) => s.log_id === l.id)
          .map((s) => ({
            exercise: (names.get(s.exercise_id) as string) ?? "Exercise",
            setNo: s.set_no,
            warmup: !!s.is_warmup,
            weight: s.weight != null ? String(s.weight) : "—",
            reps: s.reps != null ? String(s.reps) : "—",
          })),
      })),
      live: true,
    };
  } catch {
    return fallback;
  }
}

export async function getTrackSession(sessionId: string): Promise<{
  title: string;
  exercises: TrackExercise[];
  history: TrackHistory[];
  live: boolean;
}> {
  const fallback = { title: "", exercises: [], history: [], live: false };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fallback;

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    if (!client) return fallback;

    const { data: session } = await supabase
      .from("workout_sessions")
      .select("id, title")
      .eq("id", sessionId)
      .eq("client_id", client.id)
      .single();
    if (!session) return fallback;

    const { data: exercises } = await supabase
      .from("exercises")
      .select("id, name, sets")
      .eq("session_id", sessionId)
      .order("position", { ascending: true });
    if (!exercises || exercises.length === 0) return fallback;

    // Prefill from the most recent log of this session (last performance).
    const { data: lastLog } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("session_id", sessionId)
      .eq("client_id", client.id)
      .order("performed_on", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    const prefill = new Map<string, TrackExercise["prefill"]>();
    if (lastLog) {
      const { data: lastSets } = await supabase
        .from("set_logs")
        .select("exercise_id, weight, reps, is_warmup, set_no")
        .eq("log_id", lastLog.id)
        .order("set_no", { ascending: true });
      for (const s of lastSets ?? []) {
        const arr = prefill.get(s.exercise_id) ?? [];
        arr.push({
          weight: s.weight != null ? String(s.weight) : "",
          reps: s.reps != null ? String(s.reps) : "",
          warmup: !!s.is_warmup,
        });
        prefill.set(s.exercise_id, arr);
      }
    }

    const { data: logs } = await supabase
      .from("workout_logs")
      .select("id, performed_on")
      .eq("session_id", sessionId)
      .eq("client_id", client.id)
      .order("performed_on", { ascending: false })
      .limit(10);

    return {
      title: session.title,
      exercises: exercises.map((e) => ({
        id: e.id,
        name: e.name,
        plannedSets: e.sets,
        prefill: prefill.get(e.id) ?? [],
      })),
      history: (logs ?? []).map((l) => ({
        id: l.id,
        performedOn: String(l.performed_on),
      })),
      live: true,
    };
  } catch {
    return fallback;
  }
}
