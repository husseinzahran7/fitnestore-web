"use server";

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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) return { error: "Invalid email or password." };

  revalidatePath("/", "layout");
  redirect(await homeForRole(supabase, data.user.id, email.split("@")[0]));
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
