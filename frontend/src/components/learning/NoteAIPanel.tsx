"use client";

import { useState } from "react";

type AIAction = "summarize" | "quiz" | "ask";

type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

type QuizResult = {
  title?: string;
  questions?: QuizQuestion[];
};

type Props = {
  title: string;
  getContent: () => string;
};

const API_URL =
  process.env.NEXT_PUBLIC_ORCADIO_API_URL || "http://127.0.0.1:8000";

function SparkleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
      <path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z" />
    </svg>
  );
}

function SummaryIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </svg>
  );
}

function QuizIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function AskIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.8.9c0 1.7-2.3 2-2.3 3.6" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

const actions = [
  { value: "summarize", label: "Summary", Icon: SummaryIcon },
  { value: "quiz", label: "Quiz", Icon: QuizIcon },
  { value: "ask", label: "Ask AI", Icon: AskIcon },
] as const;

const primaryButton = `mt-2 flex min-h-11 w-full items-center justify-center gap-2
  rounded-full bg-[#F72585] px-4 py-2.5 text-sm font-bold text-white
  shadow-[0_7px_24px_rgba(247,37,133,0.22)]
  transition-[background-color,box-shadow] duration-200
  hover:bg-[#E01E78] hover:shadow-[0_8px_25px_rgba(247,37,133,0.32)]
  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]
  focus-visible:ring-offset-2 focus-visible:ring-offset-white
  disabled:cursor-not-allowed disabled:opacity-50`;

export default function NoteAIPanel({ title, getContent }: Props) {
  const [action, setAction] = useState<AIAction>("summarize");
  const [result, setResult] = useState<string | QuizResult | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAI(selectedAction: AIAction) {
    const content = getContent();

    if (!content.replace(/<[^>]*>/g, "").trim()) {
      setError("Write some learning material in your note first.");
      setResult(null);
      return;
    }

    if (selectedAction === "ask" && !question.trim()) {
      setError("Enter a question about your note.");
      return;
    }

    setAction(selectedAction);
    setLoading(true);
    setError("");
    setResult(null);

    const body = {
      title: title || "Learning note",
      content,
      ...(selectedAction === "ask" ? { question: question.trim() } : {}),
      ...(selectedAction === "quiz" ? { number_of_questions: 5 } : {}),
    };

    try {
      const response = await fetch(`${API_URL}/ai/${selectedAction}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "The AI request failed. Please try again."
        );
      }

      setResult(data.result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the AI backend."
      );
    } finally {
      setLoading(false);
    }
  }

  function changeAction(value: AIAction) {
    setAction(value);
    setError("");
    setResult(null);
  }

  return (
    <aside className="flex h-full min-h-[440px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#21005e]/15 bg-white">
      <header className="relative bg-[#21005e] px-4 py-4">
        <span className="absolute inset-x-0 top-0 h-[3px] bg-[#FACC15]" />
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FACC15]">
            <SparkleIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-white">
              Prognition AI
            </h2>
            <p className="mt-0.5 text-xs text-white/70">
              Your learning assistant
            </p>
          </div>

          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-white/20 px-2 py-1 text-[10px] font-semibold text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4CC9A0]" />
            AI
          </span>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-1 border-b border-[#21005e]/10 bg-[#A78BFA]/[0.08] p-2">
        {actions.map(({ value, label, Icon }) => {
          const active = action === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => changeAction(value)}
              aria-pressed={active}
              className={`flex min-w-0 items-center justify-center gap-1.5 rounded-full px-1.5 py-2.5 text-xs font-bold
                transition-colors duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15] ${
                  active
                    ? "bg-[#21005e] text-white"
                    : "text-[#21005e]/70 hover:bg-white hover:text-[#21005e]"
                }`}
            >
              <Icon
                className={`h-3.5 w-3.5 shrink-0 ${
                  active ? "text-[#FACC15]" : ""
                }`}
              />
              {label}
            </button>
          );
        })}
      </div>

      {action === "ask" && (
        <form
          className="border-b border-[#21005e]/10 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void runAI("ask");
          }}
        >
          <label
            htmlFor="note-ai-question"
            className="mb-2 block text-xs font-bold text-[#21005e]"
          >
            Ask about your note
          </label>

          <textarea
            id="note-ai-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What does this concept mean?"
            rows={3}
            className="w-full resize-y rounded-xl border border-[#21005e]/15
              bg-white p-3 text-sm text-[#21005e] outline-none
              placeholder:text-[#21005e]/35 focus:border-[#F72585]
              focus:ring-2 focus:ring-[#FACC15]/40"
          />

          <button type="submit" disabled={loading} className={primaryButton}>
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Thinking…
              </>
            ) : (
              <>
                <SparkleIcon className="h-4 w-4" />
                Ask question
              </>
            )}
          </button>
        </form>
      )}

      {action !== "ask" && (
        <div className="border-b border-[#21005e]/10 p-3">
          <button
            type="button"
            onClick={() => void runAI(action)}
            disabled={loading}
            className={primaryButton.replace("mt-2 ", "")}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Generating…
              </>
            ) : (
              <>
                <SparkleIcon className="h-4 w-4" />
                {action === "summarize"
                  ? "Generate summary"
                  : "Generate quiz"}
              </>
            )}
          </button>
        </div>
      )}

      <div
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4"
      >
        {loading && (
          <div className="space-y-3">
            <div className="h-3 w-2/3 animate-pulse rounded bg-[#A78BFA]/20" />
            <div className="h-3 w-full animate-pulse rounded bg-[#A78BFA]/20" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-[#A78BFA]/20" />
            <p className="text-xs text-[#21005e]/60">
              Prognition is working with your note…
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        )}

        {!loading && !error && result === null && (
          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FACC15]/20 text-[#21005e]">
              <SparkleIcon className="h-6 w-6" />
            </div>

            <p className="text-sm font-extrabold text-[#21005e]">
              Ready to help you learn
            </p>

            <p className="mt-2 max-w-56 text-xs leading-5 text-[#21005e]/65">
              Summarize your notes, test your knowledge, or ask questions
              about your learning material.
            </p>
          </div>
        )}

        {!loading && !error && typeof result === "string" && (
          <div className="whitespace-pre-wrap break-words text-sm leading-7 text-[#21005e]/80">
            {result}
          </div>
        )}

        {!loading &&
          !error &&
          result !== null &&
          typeof result !== "string" && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#21005e]">
                <SparkleIcon className="h-4 w-4 text-[#F72585]" />
                {result.title || "Your quiz"}
              </h3>

              {(result.questions || []).map((item, index) => (
                <QuizCard
                  key={`${index}-${item.question}`}
                  item={item}
                  index={index}
                />
              ))}

              {(!result.questions || result.questions.length === 0) && (
                <p className="text-sm text-[#21005e]/65">
                  No questions were returned. Try generating the quiz again.
                </p>
              )}
            </div>
          )}
      </div>
    </aside>
  );
}

function QuizCard({
  item,
  index,
}: {
  item: QuizQuestion;
  index: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = selected === item.correct_answer;

  return (
    <section className="relative overflow-hidden rounded-xl border border-[#A78BFA]/35 bg-[#A78BFA]/[0.05] p-3 pt-4">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-[#A78BFA]" />

      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#21005e]/55">
        Question {index + 1}
      </p>

      <p className="mt-2 text-sm font-semibold leading-6 text-[#21005e]">
        {item.question}
      </p>

      <div className="mt-3 space-y-2">
        {item.options.map((option) => {
          const isSelected = selected === option;
          const isAnswer = revealed && option === item.correct_answer;

          return (
            <button
              key={option}
              type="button"
              disabled={revealed}
              onClick={() => setSelected(option)}
              className={`w-full rounded-lg border px-3 py-2 text-left
                text-xs leading-5 transition-colors duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15] ${
                  isAnswer
                    ? "border-[#4CC9A0] bg-[#4CC9A0]/15 font-semibold text-[#21005e]"
                    : isSelected
                      ? "border-[#F72585] bg-[#F72585]/10 font-semibold text-[#21005e]"
                      : "border-[#21005e]/12 bg-white text-[#21005e]/75 hover:border-[#A78BFA] hover:bg-white"
                }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!revealed && (
        <button
          type="button"
          disabled={!selected}
          onClick={() => setRevealed(true)}
          className="mt-3 rounded-full bg-[#21005e] px-4 py-2 text-xs
            font-bold text-white transition-colors duration-200 hover:bg-[#360099]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]
            disabled:cursor-not-allowed disabled:opacity-40"
        >
          Check answer
        </button>
      )}

      {revealed && (
        <div className="mt-3 rounded-lg border border-[#21005e]/10 bg-white p-3 text-xs leading-5 text-[#21005e]/75">
          <p
            className={`font-bold ${
              isCorrect ? "text-[#0D8F6B]" : "text-red-600"
            }`}
          >
            {isCorrect ? "Correct!" : "Not quite."}
          </p>

          <p className="mt-1">
            Correct answer: {item.correct_answer}
          </p>

          <p className="mt-1">{item.explanation}</p>
        </div>
      )}
    </section>
  );
}
