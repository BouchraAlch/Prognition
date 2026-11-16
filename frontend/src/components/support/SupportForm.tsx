"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const TOPICS = ["Question", "Bug", "Feedback", "Account"] as const;

const INPUT =
  "w-full rounded-lg border border-[#DED5C5] bg-[#F8F5ED] px-3 py-2.5 text-sm text-[#353B2E] placeholder:text-[#353B2E]/40 outline-none transition duration-200 focus:border-[#667653] focus:bg-white focus:ring-2 focus:ring-[#667653]/15";

const LABEL = "mb-1 block text-xs font-semibold text-[#353B2E]";

export function SupportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] =
    useState<(typeof TOPICS)[number]>("Question");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error ?? "Could not send your message. Please try again."
        );
      }

      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
      setTopic("Question");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div
        role="status"
        className="mt-6 rounded-xl border border-[#667653]/30 bg-[#667653]/[0.08] p-5"
      >
        <p className="text-sm font-bold text-[#353B2E]">
          Message sent successfully
        </p>

        <p className="mt-1 text-sm leading-6 text-[#353B2E]/70">
          Thanks for reaching out. We’ll reply to the email you provided.
        </p>

        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 rounded-full border border-[#DED5C5] bg-white px-4 py-2 text-xs font-semibold text-[#353B2E] transition hover:bg-[#F8F5ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#667653]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      {/* Name and Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="support-name" className={LABEL}>
            Name
          </label>

          <input
            id="support-name"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={INPUT}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="support-email" className={LABEL}>
            Email
          </label>

          <input
            id="support-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT}
            placeholder="you@gmail.com"
            autoComplete="email"
          />
        </div>
      </div>

      {/* Topic */}
      <div>
        <span className={LABEL}>Topic</span>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TOPICS.map((option) => {
            const selected = topic === option;

            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => setTopic(option)}
                className={`min-h-10 rounded-lg border px-2 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#667653] ${
                  selected
                    ? "border-[#667653] bg-[#667653]/10 text-[#526344] ring-1 ring-[#667653]/20"
                    : "border-[#DED5C5] bg-white text-[#353B2E]/65 hover:bg-[#F8F5ED]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="support-message" className={LABEL}>
          Message
        </label>

        <textarea
          id="support-message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${INPUT} resize-y`}
          placeholder="Tell us what happened or what you need help with."
        />

        <p className="mt-1 text-right text-[10px] text-[#353B2E]/45">
          {message.length}/2000
        </p>
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700"
        >
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#667653] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(102,118,83,0.20)] transition duration-200 hover:bg-[#526344] hover:shadow-[0_6px_20px_rgba(82,99,68,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#667653] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}