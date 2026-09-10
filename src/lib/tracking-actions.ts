"use server";

import { revalidatePath } from "next/cache";
import { createClient, requireActive } from "@/lib/supabase/server";

export type SaveState = { error?: string; ok?: boolean };

interface InSet {
  weight: string;
  reps: string;
  warmup: boolean;
}

interface InExercise {
  exerciseId: string;
  position: number;
  sets: InSet[];
}

export async function saveWorkout(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  const sessionId = String(formData.get("sessionId") ?? "");
  const title = String(formData.get("title") ?? "Workout").slice(0, 80) || "Workout";
  let items: InExercise[];
  try {
    items = JSON.parse(String(formData.get("payload") ?? "[]"));
  } catch {
    return { error: "Invalid workout data." };
  }
  if (!sessionId || !Array.isArray(items) || items.length === 0) {
    return { error: "Nothing to save." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet — workout not saved." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out. Sign in again." };
  if (!(await requireActive())) return { error: "Account suspended." };

  const { ensureMyClientId } = await import("@/lib/ensure-client");
  const clientId = await ensureMyClientId(supabase, user.id);
  if (!clientId) return { error: "No client record found." };

  const { data: session } = await supabase
    .from("workout_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("client_id", clientId)
    .single();
  if (!session) return { error: "Session not found." };

  const rows: Array<{
    exercise_id: string;
    set_no: number;
    is_warmup: boolean;
    weight: number | null;
    reps: number | null;
  }> = [];
  for (const ex of items) {
    if (!ex || typeof ex.exerciseId !== "string" || !Array.isArray(ex.sets)) {
      return { error: "Invalid workout data." };
    }
    // Blank rows are skipped — only logged sets persist.
    const logged = ex.sets.filter(
      (s) => s.weight.trim() !== "" || s.reps.trim() !== "" || s.warmup
    );
    logged.forEach((s, i) => {
      const w = s.weight.trim() === "" ? null : Number(s.weight);
      const r = s.reps.trim() === "" ? null : parseInt(s.reps, 10);
      if ((w != null && (!Number.isFinite(w) || w < 0)) || (r != null && (!Number.isInteger(r) || r < 0))) {
        return { error: "Weights and reps must be positive numbers." };
      }
      rows.push({
        exercise_id: ex.exerciseId,
        set_no: i + 1,
        is_warmup: !!s.warmup,
        weight: w,
        reps: r,
      });
    });
  }
  if (rows.length === 0) return { error: "Log at least one set." };

  try {
    const { data: log, error: logError } = await supabase
      .from("workout_logs")
      .insert({ client_id: clientId, session_id: sessionId, title })
      .select("id")
      .single();
    if (logError || !log) return { error: "Couldn't save. Try again." };

    const { error: setsError } = await supabase.from("set_logs").insert(
      rows.map((r) => ({ ...r, log_id: log.id }))
    );
    if (setsError) return { error: "Couldn't save sets. Try again." };

    // Persist drag-drop order (owner-reorder policy covers this).
    for (const ex of items) {
      await supabase
        .from("exercises")
        .update({ position: ex.position })
        .eq("id", ex.exerciseId);
    }
  } catch {
    return { error: "Couldn't save. Try again." };
  }

  revalidatePath("/dashboard/schedule");
  return { ok: true };
}
