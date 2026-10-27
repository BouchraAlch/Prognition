export type SubjectStatus = "studying" | "paused" | "ended";

export interface Subject {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image: string | null;
  gradient: string | null;
  status: SubjectStatus;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  user_id: string;
  subject_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  topic_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}
export interface SupportMessage {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  topic: "Question" | "Bug" | "Feedback" | "Account";
  message: string;
  created_at: string;
}