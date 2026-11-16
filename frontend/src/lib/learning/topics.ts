import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Subject, Topic } from "@/lib/types/database";

export async function getSubjectById(subjectId: string): Promise<Subject | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", subjectId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Subject) ?? null;
}

export async function listTopicsBySubject(subjectId: string): Promise<Topic[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Topic[];
}

export async function createTopic(subjectId: string, title: string): Promise<Topic> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("topics")
    .insert({ user_id: user.id, subject_id: subjectId, title })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Topic;
}


export async function deleteTopic(
  topicId: string,
  subjectId: string
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("topics")
    .delete()
    .eq("id", topicId)
    .eq("subject_id", subjectId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (!data) {
    throw new Error("Topic not found or you don't have permission to delete it.");
  }
}
