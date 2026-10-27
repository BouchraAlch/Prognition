"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Subject } from "@/lib/types/database";
import { NewSubjectModal } from "./NewSubjectModal";

const DEFAULT_IMAGE = "/img12.jpg";

const STATUS_LABEL: Record<Subject["status"], string> = {
  studying: "In progress",
  paused: "Paused",
  ended: "Finished",
};

const STATUS_STYLE: Record<
  Subject["status"],
  { badge: string; dot: string }
> = {
  studying: {
    badge: "border-[#FACC15]/40 bg-[#1A0550]/75 text-white",
    dot: "bg-[#FACC15]",
  },
  paused: {
    badge: "border-amber-200/30 bg-[#1A0550]/75 text-white",
    dot: "bg-amber-400",
  },
  ended: {
    badge: "border-emerald-200/30 bg-[#1A0550]/75 text-white",
    dot: "bg-emerald-400",
  },
};

export function SubjectCard({ subject }: { subject: Subject }) {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const status = STATUS_STYLE[subject.status];
  const image = subject.image || DEFAULT_IMAGE;

  const lastEdited = new Date(subject.updated_at).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  useEffect(() => {
    if (!menuOpen) return;

    function onClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  async function handleDelete() {
    setDeleting(true);

    try {
      const res = await fetch("/api/learning/subjects", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: subject.id }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
      setMenuOpen(false);
    }
  }

  return (
    <>
      <article className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[#E6DDF8] bg-[#1A0550] shadow-sm shadow-[#240765]/[0.06] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7209B7]/25 hover:border-[#F72585]/40">
        <Link
          href={`/learning/${subject.id}`}
          aria-label={`Open ${subject.title}`}
          className="absolute inset-0 block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FACC15]"
        >
          {/* Cover image */}
          <img
            src={image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />

          {/* Light bottom fade only behind the text, so the photo keeps its natural colors */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

          {/* Card content */}
          <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
            <span
              className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-wide backdrop-blur-md sm:text-[11px] ${status.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {STATUS_LABEL[subject.status]}
            </span>

            <h3 className="line-clamp-2 pr-2 text-lg font-bold leading-snug tracking-tight sm:text-xl">
              {subject.title}
            </h3>

            {subject.description && (
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/70">
                {subject.description}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/15 pt-3">
              <span className="text-[10px] text-white/55 sm:text-[11px]">
                Updated {lastEdited}
              </span>

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 transition group-hover:border-[#FACC15] group-hover:bg-[#F72585]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {/* Options */}
        <div ref={menuRef} className="absolute right-3 top-3 z-30">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen((value) => !value);
            }}
            aria-label={`Options for ${subject.title}`}
            aria-expanded={menuOpen}
            title="Subject options"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#1A0550]/60 text-white shadow-sm backdrop-blur-md transition hover:border-[#FACC15] hover:bg-[#FACC15] hover:text-[#240765] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="12" cy="5" r="1.7" />
              <circle cx="12" cy="12" r="1.7" />
              <circle cx="12" cy="19" r="1.7" />
            </svg>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-[#E6DDF8] bg-white p-1.5 shadow-xl shadow-[#240765]/15"
              role="menu"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setEditing(true);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#240765] transition hover:bg-[#F72585]/10 hover:text-[#7209B7]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </svg>
                Edit subject
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmDelete(true);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 15H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
                Delete subject
              </button>
            </div>
          )}
        </div>
      </article>

      {/* Edit modal */}
      <NewSubjectModal
        open={editing}
        onClose={() => setEditing(false)}
        subject={subject}
      />

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A0550]/60 p-4 backdrop-blur-md"
          onClick={() => !deleting && setConfirmDelete(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-subject-title"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl shadow-[#1A0550]/25"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-7">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 15H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </div>

              <h2
                id="delete-subject-title"
                className="text-xl font-bold tracking-tight text-[#240765]"
              >
                Delete this subject?
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#240765]/65">
                <strong className="font-semibold text-[#240765]">
                  {subject.title}
                </strong>{" "}
                and all its topics and notes will be permanently deleted.
                This cannot be undone.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#E6DDF8] bg-[#FAF7FF] px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmDelete(false)}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#240765]/65 transition hover:bg-[#F0E8FF] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete subject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
