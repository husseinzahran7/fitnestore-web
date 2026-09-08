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
  setCount: number;
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
    let prefill = new Map<string, TrackExercise["prefill"]>();
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
        setCount: 0,
      })),
      live: true,
    };
  } catch {
    return fallback;
  }
}
