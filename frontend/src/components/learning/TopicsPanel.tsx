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
    <aside className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#F72585]/30 bg-[#F72585]/[0.04] md:max-h-[calc(100vh-7rem)]">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-[#F72585]" />

      <div className="flex items-center justify-between gap-2 border-b border-[#21005e]/10 px-4 pb-4 pt-5">
        <div>
          <h2 className="text-sm font-extrabold text-[#21005e]">Topics</h2>
          <p className="mt-0.5 text-xs text-[#21005e]/55">
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
            transition-[background-color,box-shadow] duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]
            focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              creating
                ? "border border-[#21005e]/25 bg-white text-[#21005e] hover:bg-[#21005e]/[0.06]"
                : "bg-[#F72585] text-white shadow-[0_7px_24px_rgba(247,37,133,0.22)] hover:bg-[#E01E78] hover:shadow-[0_8px_25px_rgba(247,37,133,0.32)]"
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
          className="border-b border-[#21005e]/10 bg-white/70 p-3"
        >
          <label
            htmlFor="new-topic-title"
            className="mb-2 block text-xs font-semibold text-[#21005e]/70"
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
            className="w-full rounded-xl border border-[#21005e]/15 bg-white
              px-3 py-2.5 text-sm text-[#21005e] outline-none
              placeholder:text-[#21005e]/35 focus:border-[#F72585]
              focus:ring-2 focus:ring-[#FACC15]/40"
          />

          {error && (
            <p role="alert" className="mt-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="rounded-full bg-[#F72585] px-4 py-2 text-xs font-bold
                text-white transition-colors duration-200 hover:bg-[#E01E78]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]
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
                text-[#21005e]/70 transition-colors hover:bg-[#21005e]/[0.06]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {topics.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F72585]/10 text-[#F72585]">
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
            <p className="text-sm font-bold text-[#21005e]">
              No topics yet
            </p>
            <p className="mt-1 text-xs leading-5 text-[#21005e]/60">
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
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15] ${
                        active
                          ? "border-[#F72585]/40 bg-white font-bold text-[#21005e]"
                          : "border-transparent text-[#21005e]/70 hover:bg-white/80 hover:text-[#21005e]"
                      }`}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        active
                          ? "bg-[#F72585]"
                          : "bg-[#21005e]/20 group-hover:bg-[#A78BFA]"
                      }`}
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {topic.title}
                    </span>
                    {active && (
                      <span className="text-xs text-[#F72585]">→</span>
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
