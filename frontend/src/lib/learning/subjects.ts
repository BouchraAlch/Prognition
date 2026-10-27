import { createSupabaseServerClient } from "@/lib/supabase/server";

import type {
  Subject,
  SubjectStatus,
} from "@/lib/types/database";

const DEFAULT_IMAGE = "/img2.jpg";

export async function listSubjects(): Promise<Subject[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Subject[];
}

export interface CreateSubjectInput {
  title: string;
  description?: string | null;
  image?: string | null;
  gradient?: string | null;
  status: SubjectStatus;
}

export async function createSubject(
  input: CreateSubjectInput
): Promise<Subject> {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("subjects")
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description ?? null,
      image: input.image || DEFAULT_IMAGE,
      gradient: input.gradient ?? null,
      status: input.status,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Subject;
}

export interface UpdateSubjectInput {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  gradient?: string | null;
  status: SubjectStatus;
}

export async function updateSubject(
  input: UpdateSubjectInput
): Promise<Subject> {
  const supabase =
    await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("subjects")
    .update({
      title: input.title,
      description: input.description ?? null,
      image: input.image || DEFAULT_IMAGE,
      gradient: input.gradient ?? null,
      status: input.status,
    })
    .eq("id", input.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Subject;
}