import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Note } from "@/lib/types/database";

export async function getOrCreateNote(topicId: string): Promise<Note> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing, error: selectErr } = await supabase
    .from("notes")
    .select("*")
    .eq("topic_id", topicId)
    .maybeSingle();

  if (selectErr) throw new Error(selectErr.message);
  if (existing) return existing as Note;

  const { data, error } = await supabase
    .from("notes")
    .insert({ user_id: user.id, topic_id: topicId, content: "" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Note;
}

export async function updateNote(noteId: string, content: string): Promise<Note> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("notes")
    .update({ content })
    .eq("id", noteId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Note;
}