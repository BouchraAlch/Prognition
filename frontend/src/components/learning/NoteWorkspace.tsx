"use client";

import { useEffect, useState } from "react";
import { NoteEditor } from "./NoteEditor";

interface Props {
  selectedTopicId: string | null;
  selectedTopicTitle: string | null;
}

export function NoteWorkspace({
  selectedTopicId,
  selectedTopicTitle,
}: Props) {
  const [note, setNote] = useState<{
    id: string;
    content: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedTopicId) {
      setNote(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);
    setNote(null);

    fetch("/api/learning/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId: selectedTopicId }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load your note.");

        const data = await res.json();

        if (!cancelled) {
          setNote({
            id: data.id,
            content: data.content ?? "",
          });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading your note."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedTopicId]);

  const stateClass =
    "relative flex min-h-[50vh] items-center justify-center overflow-hidden rounded-2xl border border-[#21005e]/12 bg-white px-6 text-center";

  if (!selectedTopicId) {
    return (
      <div className={`${stateClass} border-dashed border-[#A78BFA]/50 bg-[#A78BFA]/[0.06]`}>
        <div className="max-w-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F72585]/10 text-[#F72585]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
            </svg>
          </div>
          <h3 className="font-extrabold text-[#21005e]">
            Start with a topic
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#21005e]/70">
            Select an existing topic or create a new one to start taking notes.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${stateClass} text-sm text-[#21005e]/70`}>
        <span className="absolute inset-x-0 top-0 h-[3px] bg-[#FACC15]" />
        <div>
          <span className="mx-auto mb-3 block h-6 w-6 animate-spin rounded-full border-2 border-[#21005e]/15 border-t-[#F72585]" />
          Loading your note…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${stateClass} text-sm text-red-600`}>
        <span className="absolute inset-x-0 top-0 h-[3px] bg-red-500" />
        <div>
          <p className="font-bold">Unable to load this note</p>
          <p className="mt-2 text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <NoteEditor
      key={note.id}
      noteId={note.id}
      initialContent={note.content}
      title={selectedTopicTitle}
    />
  );
}
