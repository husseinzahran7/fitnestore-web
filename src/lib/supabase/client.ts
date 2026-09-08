import { createBrowserClient } from "@supabase/ssr";

function env(name: string): string {
  const value =
    process.env[`NEXT_PUBLIC_SUPABASE_${name}`] ??
    (name === "KEY" ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined);
  if (!value) {
    throw new Error(
      `Missing env: NEXT_PUBLIC_SUPABASE_${name} (see .env.example)`
    );
  }
  return value;
}

export function createClient() {
  return createBrowserClient(env("URL"), env("KEY"));
}
