"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; notice?: string };

async function homeForRole(
  supabase: SupabaseClient,
  userId: string,
  fallbackName: string
): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!data) {
    // First login with no profile row (e.g. dashboard-seeded user) → provision.
    await supabase
      .from("profiles")
      .insert({ id: userId, role: "user", name: fallbackName });
    return "/dashboard";
  }
  if (data.role === "coach") return "/coach";
  if (data.role === "admin") return "/admin";
  return "/dashboard";
}

export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) return { error: "Invalid email or password." };

  revalidatePath("/", "layout");
  const home = await homeForRole(supabase, data.user.id, email.split("@")[0]);
  if (next.startsWith("/") && !next.startsWith("//")) redirect(next);
  redirect(home);
}

export async function signup(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim() || "Member";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  if (!data.user) return { error: "Could not create account. Try again." };

  if (!data.session) {
    return {
      notice: "Account created — check your email to confirm, then sign in.",
    };
  }

  await supabase
    .from("profiles")
    .insert({ id: data.user.id, role: "user", name });
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signInWithGoogle(): Promise<AuthState> {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Supabase not connected yet." };
  }
  const origin = (await headers()).get("origin") ?? "";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error || !data.url) {
    return { error: "Google sign-in is not enabled yet." };
  }
  redirect(data.url);
}
