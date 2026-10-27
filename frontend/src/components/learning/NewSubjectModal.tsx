"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import type { Subject, SubjectStatus } from "@/lib/types/database";

interface Props {
  open: boolean;
  onClose: () => void;
  subject?: Subject;
}

const DEFAULT_IMAGE = "/img2.jpg";

const STATUS_OPTIONS: {
  value: SubjectStatus;
  label: string;
  dot: string;
}[] = [
  {
    value: "studying",
    label: "In progress",
    dot: "bg-[#3A0CA3]",
  },
  {
    value: "paused",
    label: "Paused",
    dot: "bg-amber-500",
  },
  {
    value: "ended",
    label: "Finished",
    dot: "bg-emerald-500",
  },
];

const INPUT =
  "w-full rounded-lg border border-[#E6DDF8] bg-[#FAF7FF] px-3 py-2 text-sm text-[#240765] placeholder:text-[#240765]/35 outline-none transition duration-200 focus:border-[#3A0CA3] focus:bg-white focus:ring-2 focus:ring-[#3A0CA3]/10";

const LABEL = "mb-1 block text-xs font-semibold text-[#240765]";

export function NewSubjectModal({ open, onClose, subject }: Props) {
  const router = useRouter();
  const isEdit = !!subject;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(DEFAULT_IMAGE);
  const [status, setStatus] = useState<SubjectStatus>("studying");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setError(null);

    if (subject) {
      setTitle(subject.title);
      setDescription(subject.description ?? "");
      setImageFile(null);
      setImagePreview(subject.image || DEFAULT_IMAGE);
      setStatus(subject.status);
    } else {
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(DEFAULT_IMAGE);
      setStatus("studying");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [open, subject]);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, loading]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!open) return null;

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please choose a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeSelectedImage() {
    setImageFile(null);
    setImagePreview(subject?.image || DEFAULT_IMAGE);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("status", status);

      if (isEdit) {
        formData.append("id", subject!.id);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/learning/subjects", {
        method: isEdit ? "PATCH" : "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        throw new Error(
          body.error ??
            (isEdit
              ? "Failed to update subject"
              : "Failed to create subject")
        );
      }

      onClose();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const currentStatus = STATUS_OPTIONS.find(
    (option) => option.value === status
  )!;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#1A0550]/60 p-2 backdrop-blur-md sm:p-3"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div className="flex min-h-full w-full items-center justify-center py-2">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="subject-modal-title"
          className="w-full max-w-[340px] overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_20px_60px_rgba(26,5,80,0.25)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Compact cover image without a color overlay */}
          <div className="relative h-24 overflow-hidden bg-[#F7F3FF]">
            <img
              src={imagePreview}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
            />

            <div className="relative flex h-full flex-col justify-between p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#240765]">
                  {isEdit ? "Edit subject" : "New subject"}
                </span>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Close modal"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#240765] transition hover:bg-white disabled:opacity-50"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div>
                <h2
                  id="subject-modal-title"
                  className="line-clamp-1 text-base font-bold tracking-tight text-[#240765] [text-shadow:0_1px_3px_rgba(255,255,255,0.8)]"
                >
                  {title || "Untitled subject"}
                </h2>

                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-[10px] text-[#240765]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`}
                  />
                  {currentStatus.label}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 p-3">
            {/* Title */}
            <div>
              <label htmlFor="subject-title" className={LABEL}>
                Subject title
              </label>

              <input
                id="subject-title"
                required
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={INPUT}
                placeholder="e.g. Computer Vision"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="subject-description" className={LABEL}>
                Description{" "}
                <span className="font-normal text-[#240765]/45">
                  (optional)
                </span>
              </label>

              <textarea
                id="subject-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className={`${INPUT} resize-none`}
                placeholder="What would you like to learn?"
              />
            </div>

            {/* Cover image */}
            <div>
              <label className={LABEL}>Cover image</label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6DDF8] bg-white px-2.5 py-2 text-xs font-semibold text-[#240765] transition hover:border-[#F72585]/50 hover:bg-[#F7F3FF]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-[#7209B7]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                  Choose image
                </button>

                {imageFile && (
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="text-xs font-medium text-red-600 transition hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <p className="mt-1 text-[10px] leading-4 text-[#240765]/45">
                JPG, PNG or WebP. Maximum 5 MB.
              </p>

              {imageFile && (
                <p className="mt-1 truncate text-[10px] text-[#240765]/70">
                  {imageFile.name}
                </p>
              )}
            </div>

            {/* Learning status */}
            <div>
              <label className={LABEL}>Learning status</label>

              <div className="grid grid-cols-3 gap-1.5">
                {STATUS_OPTIONS.map((option) => {
                  const selected = status === option.value;

                  return (
                    <button
                      type="button"
                      key={option.value}
                      aria-pressed={selected}
                      onClick={() => setStatus(option.value)}
                      className={`flex min-h-9 items-center justify-center gap-1 rounded-lg border px-1 py-1.5 text-[10px] font-semibold transition ${
                        selected
                          ? "border-[#3A0CA3] bg-[#3A0CA3]/[0.07] text-[#3A0CA3] ring-1 ring-[#3A0CA3]/15"
                          : "border-[#E6DDF8] bg-white text-[#240765]/65 hover:bg-[#F7F3FF]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${option.dot}`}
                      />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-100 bg-red-50 px-2.5 py-2 text-xs leading-4 text-red-600"
              >
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-1.5 border-t border-[#E6DDF8] pt-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-full px-4 py-2 text-xs font-semibold text-[#240765]/65 transition hover:bg-[#F7F3FF] hover:text-[#240765] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#3A0CA3] to-[#7209B7] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(114,9,183,0.30)] transition hover:from-[#F72585] hover:to-[#7209B7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? isEdit
                    ? "Saving..."
                    : "Creating..."
                  : isEdit
                    ? "Save changes"
                    : "Create subject"}

                {!loading && (
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
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
