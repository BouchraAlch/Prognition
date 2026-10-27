
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";

import { EditorToolbar } from "./EditorToolbar";
import { FontSize } from "./FontSize";
import NoteAIPanel from "@/components/learning/NoteAIPanel";

interface Props {
  noteId: string;
  initialContent: string;
  title?: string | null;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function NoteEditor({
  noteId,
  initialContent,
  title,
}: Props) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [aiOpen, setAiOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelPendingSave = useCallback(() => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontSize,
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
    ],
    content: initialContent || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[55vh] px-5 py-6 text-[#21005e]/85 prose-headings:font-extrabold prose-headings:text-[#21005e] prose-a:text-[#F72585] prose-strong:text-[#21005e] prose-blockquote:border-[#A78BFA] prose-code:text-[#F72585] focus:outline-none sm:px-8 sm:py-8",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      cancelPendingSave();
      setSaveState("saving");

      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/learning/notes", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: noteId,
              content: html,
            }),
          });

          setSaveState(res.ok ? "saved" : "error");
        } catch {
          setSaveState("error");
        } finally {
          debounceRef.current = null;
        }
      }, 800);
    },
  });

  useEffect(() => {
    if (!editor) return;

    cancelPendingSave();

    editor.commands.setContent(initialContent || "<p></p>", {
      emitUpdate: false,
    });

    setSaveState("idle");
    setAiOpen(false);
  }, [noteId, initialContent, editor, cancelPendingSave]);

  useEffect(() => {
    return () => {
      cancelPendingSave();
    };
  }, [cancelPendingSave]);

  const getContent = useCallback(
    () => editor?.getHTML() ?? "",
    [editor]
  );

  return (
    <div className="min-w-0 w-full">
      <div
        className={`grid min-w-0 items-start gap-4 ${
          aiOpen
            ? "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px]"
            : "grid-cols-1"
        }`}
      >
        {/* NOTE EDITOR — LEFT SIDE */}
        <section className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-base font-extrabold tracking-tight text-[#21005e] sm:text-lg">
                {title || "My note"}
              </h2>

              <div className="mt-1 flex items-center gap-2 text-xs text-[#21005e]/60">
                <span className="flex h-2 w-2 items-center justify-center">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      saveState === "error"
                        ? "bg-red-500"
                        : saveState === "saving"
                          ? "animate-pulse bg-[#FACC15]"
                          : saveState === "saved"
                            ? "bg-[#4CC9A0]"
                            : "bg-[#21005e]/25"
                    }`}
                  />
                </span>

                {saveState === "saving" && "Saving changes…"}
                {saveState === "saved" && "All changes saved"}
                {saveState === "error" && "Could not save changes"}
                {saveState === "idle" && "Your personal notes"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAiOpen((open) => !open)}
              aria-expanded={aiOpen}
              aria-controls="note-ai-panel"
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold
                transition-[background-color,border-color,box-shadow] duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]
                focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  aiOpen
                    ? "border-[#21005e] bg-[#21005e] text-white hover:bg-[#360099]"
                    : "border-transparent bg-[#F72585] text-white shadow-[0_7px_24px_rgba(247,37,133,0.22)] hover:bg-[#E01E78] hover:shadow-[0_8px_25px_rgba(247,37,133,0.32)]"
                }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
                <path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z" />
              </svg>

              {aiOpen ? "Close AI" : "AI assistant"}
              <span className="text-xs opacity-75">
                {aiOpen ? "−" : "+"}
              </span>
            </button>
          </div>

          <div className="flex min-w-0 items-start gap-2 sm:gap-3">
            {/* EDITOR TOOLBAR */}
            <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] shrink-0 overflow-y-auto rounded-xl border border-[#21005e]/12 bg-white sm:block">
              <EditorToolbar editor={editor} />
            </aside>

            {/* NOTE CONTENT */}
            <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#A78BFA]/35 bg-white transition-colors duration-200 focus-within:border-[#A78BFA]/70">
              <span className="absolute inset-x-0 top-0 z-10 h-[3px] bg-[#A78BFA]" />

              <EditorContent editor={editor} />

              <div className="flex min-h-10 items-center justify-between gap-3 border-t border-[#21005e]/10 bg-[#A78BFA]/[0.06] px-4 py-2">
                <span className="text-xs text-[#21005e]/55">
                  Changes are saved automatically
                </span>

                {saveState === "error" && (
                  <span className="text-xs font-semibold text-red-600">
                    Save failed
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* AI ASSISTANT — RIGHT SIDE */}
        {aiOpen && (
          <aside
            id="note-ai-panel"
            className="min-w-0 w-full animate-fade-up lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]"
          >
            <NoteAIPanel
              title={title || "Learning note"}
              getContent={getContent}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
