"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Topic } from "@/lib/types/database";

interface Props {
  subjectId: string;
  topics: Topic[];
  selectedTopicId: string | null;
  onSelect: (id: string) => void;
}

export function TopicsPanel({
  subjectId,
  topics,
  selectedTopicId,
  onSelect,
}: Props) {
  const router = useRouter();

  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/learning/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          title: trimmedTitle,
        }),
      });

      if (!res.ok) {
        throw new Error("Could not create the topic. Please try again.");
      }

      setTitle("");
      setCreating(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#DED5C5] bg-[#F8F5ED] shadow-sm md:max-h-[calc(100vh-7rem)]">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-[#242820]" />

      <div className="flex items-center justify-between gap-2 border-b border-[#DED5C5] px-4 pb-4 pt-5">
        <div>
          <h2 className="text-sm font-extrabold text-[#353B2E]">
            Topics
          </h2>
          <p className="mt-0.5 text-xs text-[#777467]">
            {topics.length} {topics.length === 1 ? "topic" : "topics"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreating((value) => !value);
            setError("");
          }}
          aria-expanded={creating}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold
            transition-colors duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#242820]
            focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5ED] ${
              creating
                ? "border border-[#DED5C5] bg-white text-[#353B2E] hover:bg-[#E5D7C1]/30"
                : "bg-[#242820] text-white shadow-sm hover:bg-[#353B2E] hover:shadow-md"
            }`}
        >
          <span className="text-base leading-none">
            {creating ? "×" : "+"}
          </span>
          {creating ? "Close" : "New topic"}
        </button>
      </div>

      {creating && (
        <form
          onSubmit={handleCreate}
          className="border-b border-[#DED5C5] bg-[#F3EBDD] p-3"
        >
          <label
            htmlFor="new-topic-title"
            className="mb-2 block text-xs font-semibold text-[#242820]"
          >
            Topic name
          </label>

          <input
            id="new-topic-title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Introduction to AI"
            maxLength={120}
            className="w-full rounded-xl border border-[#DED5C5] bg-[#F8F5ED]
              px-3 py-2.5 text-sm text-[#171717] outline-none
              placeholder:text-[#777467]/65 focus:border-[#242820]
              focus:ring-2 focus:ring-[#242820]/15"
          />

          {error && (
            <p role="alert" className="mt-2 text-xs text-[#98604F]">
              {error}
            </p>
          )}

          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="rounded-full bg-[#242820] px-4 py-2 text-xs font-bold
                text-white transition-colors duration-200 hover:bg-[#353B2E]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#242820]
                disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create topic"}
            </button>

            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setTitle("");
                setError("");
              }}
              className="rounded-full px-3 py-2 text-xs font-semibold
                text-[#777467] transition-colors hover:bg-[#E5D7C1]/50
                hover:text-[#353B2E]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#242820]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {topics.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#242820]/10 text-[#242820]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>

            <p className="text-sm font-bold text-[#353B2E]">
              No topics yet
            </p>
            <p className="mt-1 text-xs leading-5 text-[#777467]">
              Create your first topic to organize your notes.
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {topics.map((topic) => {
              const active = selectedTopicId === topic.id;

              return (
                <li key={topic.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(topic.id)}
                    aria-current={active ? "true" : undefined}
                    className={`group flex w-full min-w-0 items-center gap-2.5
                      rounded-xl border px-3 py-3 text-left text-sm
                      transition-colors duration-200
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#242820] ${
                        active
                          ? "border-[#B9A68D] bg-[#E5D7C1]/35 font-bold text-[#242820]"
                          : "border-transparent text-[#526344] hover:bg-[#E5D7C1]/25 hover:text-[#242820]"
                      }`}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        active
                          ? "bg-[#242820]"
                          : "bg-[#B9A68D] group-hover:bg-[#242820]"
                      }`}
                    />

                    <span className="min-w-0 flex-1 truncate">
                      {topic.title}
                    </span>

                    {active && (
                      <span className="text-xs text-[#242820]">→</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}