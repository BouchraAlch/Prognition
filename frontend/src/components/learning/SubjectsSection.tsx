"use client";

import { useState } from "react";

import { SubjectCard } from "./SubjectCard";
import { NewSubjectModal } from "./NewSubjectModal";

import type { Subject } from "@/lib/types/database";

export function SubjectsSection({
  subjects,
}: {
  subjects: Subject[];
}) {
  const [modalOpen, setModalOpen] = useState(false);

  // Most recently updated subjects appear first.
  const sortedSubjects = [...subjects].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() -
      new Date(a.updated_at).getTime()
  );

  return (
    <section aria-labelledby="subjects-heading">
      {/* Local keyframes so the card entrance animation always works */}
      <style>{`
        @keyframes subjectFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .subject-fade-in { animation: none !important; }
        }
      `}</style>

      {/* Section header */}
      <div className="mb-7 flex flex-col gap-5 border-b border-[#E6DDF8] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7209B7]">
            Your personal library
          </span>

          <h2
            id="subjects-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-[#240765] sm:text-3xl"
          >
            My Subjects
            <span className="ml-3 inline-flex items-center justify-center rounded-full bg-[#F72585]/10 px-2.5 py-1 align-middle text-xs font-semibold text-[#F72585]">
              {sortedSubjects.length}
            </span>
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 text-[#240765]/60">
            Everything you&apos;re learning, organized in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#FACC15] px-5 py-3 text-sm font-bold text-[#240765] shadow-[0_4px_16px_rgba(250,204,21,0.30)] transition duration-200 hover:bg-[#FFE066] hover:shadow-[0_6px_20px_rgba(250,204,21,0.40)] active:scale-[0.98] sm:w-auto"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>

          New Subject
        </button>
      </div>

      {/* Empty state */}
      {sortedSubjects.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#D4C2F3] bg-[#FAF7FF] px-6 py-12 text-center sm:min-h-[420px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E6DDF8] bg-gradient-to-br from-[#3A0CA3] to-[#7209B7] text-[#FACC15] shadow-[0_0_18px_rgba(247,37,133,0.22)]">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z" />
              <path d="M4 5.5v16" />
              <path d="M8 7h8M8 11h6" />
            </svg>
          </div>

          <h3 className="mt-6 text-xl font-bold tracking-tight text-[#240765]">
            Your learning journey starts here
          </h3>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#240765]/60">
            Create your first subject to organize your lessons, keep your
            notes together, and start building your personal knowledge library.
          </p>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#FACC15] px-6 py-3 text-sm font-bold text-[#240765] shadow-[0_4px_16px_rgba(250,204,21,0.30)] transition hover:bg-[#FFE066] active:scale-[0.98]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>

            Create your first subject
          </button>
        </div>
      ) : (
        /* Subjects grid */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sortedSubjects.map((subject, index) => (
            <div
              key={subject.id}
              className="subject-fade-in"
              style={{
                animation: "subjectFadeIn 0.45s ease both",
                animationDelay: `${Math.min(index, 11) * 50}ms`,
              }}
            >
              <SubjectCard subject={subject} />
            </div>
          ))}
        </div>
      )}

      {/* Create subject modal */}
      <NewSubjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
