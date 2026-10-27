import { createSupabaseServerClient } from "@/lib/supabase/server";

export const SUPPORT_TOPICS = [
  "Question",
  "Bug",
  "Feedback",
  "Account",
] as const;

export type SupportTopic = (typeof SUPPORT_TOPICS)[number];

export interface SupportMessageInput {
  name: string;
  email: string;
  topic: SupportTopic;
  message: string;
}

export async function createSupportMessage(
  input: SupportMessageInput
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  // Visitors may not be logged in, so user_id is optional.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("support_messages").insert({
    user_id: user?.id ?? null,
    name: input.name,
    email: input.email,
    topic: input.topic,
    message: input.message,
  });

  if (error) throw new Error(error.message);
}
