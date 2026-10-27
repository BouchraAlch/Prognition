import { createSupabaseBrowserClient } from "./supabase/client";

export async function signInWithGoogle() {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google login error:", error.message);
    throw error;
  }
}