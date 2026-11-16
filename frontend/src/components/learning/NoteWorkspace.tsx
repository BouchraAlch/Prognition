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
    "relative flex min-h-[50vh] items-center justify-center overflow-hidden rounded-2xl border border-[#DED5C5] bg-[#F8F5ED] px-6 text-center";

  if (!selectedTopicId) {
    return (
      <div
        className={`${stateClass} border-dashed border-[#B9A68D] bg-[#E5D7C1]/20`}
      >
        <div className="max-w-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#667653]/10 text-[#667653]">
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

          <h3 className="font-extrabold text-[#353B2E]">
            Start with a topic
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#777467]">
            Select an existing topic or create a new one to start taking notes.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${stateClass} text-sm text-[#777467]`}>
        <span className="absolute inset-x-0 top-0 h-[3px] bg-[#B9A68D]" />
        <div>
          <span className="mx-auto mb-3 block h-6 w-6 animate-spin rounded-full border-2 border-[#DED5C5] border-t-[#667653]" />
          Loading your note…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${stateClass} text-sm text-[#98604F]`}>
        <span className="absolute inset-x-0 top-0 h-[3px] bg-[#98604F]" />
        <div>
          <p className="font-bold">Unable to load this note</p>
          <p className="mt-2 text-[#98604F]/80">{error}</p>
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