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
  rounded-full bg-[#667653] px-4 py-2.5 text-sm font-bold text-white
  shadow-sm transition-colors duration-200
  hover:bg-[#526344] hover:shadow-md
  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#667653]
  focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5ED]
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
    <aside className="flex h-full min-h-[440px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#DED5C5] bg-[#F8F5ED] shadow-sm">
      {/* Dark AI header */}
      <header className="relative bg-[#242820] px-4 py-4">
        <span className="absolute inset-x-0 top-0 h-[3px] bg-[#667653]" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D8C8AD]">
            <SparkleIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-white">
              Prognition AI
            </h2>
            <p className="mt-0.5 text-xs text-white/65">
              Your learning assistant
            </p>
          </div>

          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-white/20 px-2 py-1 text-[10px] font-semibold text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A5B58B]" />
            AI
          </span>
        </div>
      </header>

      {/* AI action tabs */}
      <div className="grid grid-cols-3 gap-1 border-b border-[#DED5C5] bg-[#E5D7C1]/35 p-2">
        {actions.map(({ value, label, Icon }) => {
          const active = action === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => changeAction(value)}
              aria-pressed={active}
              className={`flex min-w-0 items-center justify-center gap-1.5 rounded-full px-1.5 py-2.5 text-xs font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#667653] ${
                active
                  ? "bg-[#667653] text-white"
                  : "bg-[#667653]/10 text-[#526344] hover:bg-[#667653]/20"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </button>
          );
        })}
      </div>

      {action === "ask" && (
        <form
          className="border-b border-[#DED5C5] p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void runAI("ask");
          }}
        >
          <label
            htmlFor="note-ai-question"
            className="mb-2 block text-xs font-bold text-[#353B2E]"
          >
            Ask about your note
          </label>

          <textarea
            id="note-ai-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What does this concept mean?"
            rows={3}
            className="w-full resize-y rounded-xl border border-[#DED5C5] bg-[#F8F5ED] p-3 text-sm text-[#171717] outline-none placeholder:text-[#777467]/65 focus:border-[#667653] focus:ring-2 focus:ring-[#667653]/15"
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
        <div className="border-b border-[#DED5C5] p-3">
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
                {action === "summarize" ? "Generate summary" : "Generate quiz"}
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
            <div className="h-3 w-2/3 animate-pulse rounded bg-[#E5D7C1]" />
            <div className="h-3 w-full animate-pulse rounded bg-[#E5D7C1]" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-[#E5D7C1]" />
            <p className="text-xs text-[#777467]">
  Our AI service may take up to one minute to respond while the
  server wakes up. Thank you for your patience!
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-[#98604F]/25 bg-[#98604F]/10 p-3 text-sm leading-6 text-[#794638]"
          >
            {error}
          </div>
        )}

        {!loading && !error && result === null && (
          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5D7C1]/60 text-[#667653]">
              <SparkleIcon className="h-6 w-6" />
            </div>

            <p className="text-sm font-extrabold text-[#353B2E]">
              Ready to help you learn
            </p>

            <p className="mt-2 max-w-56 text-xs leading-5 text-[#777467]">
              Summarize your notes, test your knowledge, or ask questions about
              your learning material.
            </p>
          </div>
        )}

        {!loading && !error && typeof result === "string" && (
          <div className="whitespace-pre-wrap break-words text-sm leading-7 text-[#171717]">
            {result}
          </div>
        )}

        {!loading &&
          !error &&
          result !== null &&
          typeof result !== "string" && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#353B2E]">
                <SparkleIcon className="h-4 w-4 text-[#667653]" />
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
                <p className="text-sm text-[#777467]">
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
    <section className="relative overflow-hidden rounded-xl border border-[#DED5C5] bg-[#F3EBDD] p-3 pt-4">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-[#667653]" />

      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#777467]">
        Question {index + 1}
      </p>

      <p className="mt-2 text-sm font-semibold leading-6 text-[#171717]">
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
              className={`w-full rounded-lg border px-3 py-2 text-left text-xs leading-5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#667653] ${
                isAnswer
                  ? "border-[#667653] bg-[#667653]/10 font-semibold text-[#353B2E]"
                  : isSelected
                    ? "border-[#795C42] bg-[#795C42]/10 font-semibold text-[#353B2E]"
                    : "border-[#DED5C5] bg-[#F8F5ED] text-[#171717] hover:border-[#B9A68D]"
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
          className="mt-3 rounded-full bg-[#667653] px-4 py-2 text-xs font-bold text-white transition-colors duration-200 hover:bg-[#526344] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#667653] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Check answer
        </button>
      )}

      {revealed && (
        <div className="mt-3 rounded-lg border border-[#DED5C5] bg-[#F8F5ED] p-3 text-xs leading-5 text-[#171717]">
          <p
            className={`font-bold ${
              isCorrect ? "text-[#526344]" : "text-[#98604F]"
            }`}
          >
            {isCorrect ? "Correct!" : "Not quite."}
          </p>

          <p className="mt-1">Correct answer: {item.correct_answer}</p>
          <p className="mt-1">{item.explanation}</p>
        </div>
      )}
    </section>
  );
}