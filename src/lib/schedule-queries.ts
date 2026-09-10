"use server";

import { createClient } from "@/lib/supabase/server";
import type { WeeklyWorkouts } from "@/types/workout";

// Live user schedule mapped to the WeeklyWorkouts shape UserSchedule expects.
// Real columns only: workout_sessions(id, plan_id, client_id, title, day,
// time, duration, description), exercises(id, session_id, name, sets, reps,
// weight). No scheduled_date / status / notes columns exist — do not select them.
export async function getUserScheduleWeek(): Promise<{
  week: WeeklyWorkouts;
  live: boolean;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { week: {}, live: false };

    // client_id references clients(id), not the auth user id.
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    if (!client) return { week: {}, live: false };

    const { data: sessions, error } = await supabase
      .from("workout_sessions")
      .select("id, title, day, time, duration, description")
      .eq("client_id", client.id);
    if (error || !sessions || sessions.length === 0) {
      return { week: {}, live: false };
    }

    const { data: exercises } = await supabase
      .from("exercises")
      .select("session_id, name, sets, reps, weight")
      .in(
        "session_id",
        sessions.map((s) => s.id)
      );

    // Done means logged today (sessions repeat weekly; history owns past).
    const today = new Date().toISOString().slice(0, 10);
    const { data: doneLogs } = await supabase
      .from("workout_logs")
      .select("session_id")
      .eq("client_id", client.id)
      .eq("performed_on", today);
    const done = new Set((doneLogs ?? []).map((l) => l.session_id));

    const bySession = new Map<string, typeof exercises>();
    for (const e of exercises ?? []) {
      const arr = bySession.get(e.session_id) ?? [];
      arr.push(e);
      bySession.set(e.session_id, arr);
    }

    const week: WeeklyWorkouts = {};
    for (const s of sessions) {
      const key = String(s.day ?? "monday").toLowerCase();
      const list = week[key] ?? [];
      list.push({
        id: s.id,
        title: s.title,
        day: String(s.day ?? ""),
        time: String(s.time ?? ""),
        duration: String(s.duration ?? ""),
        completed: done.has(s.id),
        description: String(s.description ?? ""),
        exercises: (bySession.get(s.id) ?? []).map((e) => ({
          name: e.name,
          sets: e.sets,
          reps: String(e.reps),
          ...(e.weight ? { weight: String(e.weight) } : {}),
        })),
      });
      week[key] = list;
    }
    return { week, live: true };
  } catch {
    return { week: {}, live: false };
  }
}
