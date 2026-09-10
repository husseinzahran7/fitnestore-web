export interface CoachLink {
  id: string;
  coach_id: string;
  trainee_id: string;
  client_id: string | null;
  weeks: number;
  status: "pending" | "active" | "expired" | "revoked";
  share_history: boolean;
  payment_ref: string;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  coach_name?: string;
  trainee_name?: string;
}

export interface AppSub {
  id: string;
  user_id: string;
  weeks: number;
  status: "pending" | "active" | "expired" | "revoked";
  payment_ref: string;
  starts_at: string | null;
  ends_at: string | null;
  user_name?: string;
}

export function linkExpired(l: Pick<CoachLink, "status" | "ends_at">, now = Date.now()): boolean {
  if (l.status === "expired" || l.status === "revoked") return true;
  if (l.status !== "active") return false;
  if (!l.ends_at) return false; // activated but clock not started — not expired
  return new Date(l.ends_at).getTime() < now;
}

export function linkLive(l: CoachLink, now = Date.now()): boolean {
  return l.status === "active" && !!l.starts_at && !linkExpired(l, now);
}
