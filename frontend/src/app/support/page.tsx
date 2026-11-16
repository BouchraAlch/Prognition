import type { Metadata } from "next";
import { SupportForm } from "@/components/support/SupportForm";

export const metadata: Metadata = {
  title: "Support | Prognition",
  description: "Find answers, get started, or contact the Prognition team.",
};

const RESPONSE_TIME = "We usually reply within 24 hours.";

const STEPS = [
  {
    title: "Create a subject",
    body: "On the Learning page, select New Subject and add a title, cover image, and status.",
    color: "#667653",
  },
  {
    title: "Add topics",
    body: "Open a subject and select New topic to break it into manageable parts.",
    color: "#B9A68D",
  },
  {
    title: "Write your notes",
    body: "Pick a topic and start writing. Your changes save automatically.",
    color: "#795C42",
  },
  {
    title: "Learn with AI",
    body: "Open AI assistant in a note to get a summary, a 5-question quiz, or answers to your questions.",
    color: "#526344",
  },
];

const FAQS = [
  {
    q: "How do I create a subject or a topic?",
    a: "Select New Subject on the Learning page to create a subject. Then open it and select New topic in the Topics panel to add a topic.",
  },
  {
    q: "How do I edit or delete a subject?",
    a: "Open the ⋮ menu on the subject card and choose Edit subject or Delete subject. Deleting a subject permanently removes all of its topics and notes, so it can’t be undone.",
  },
  {
    q: "Are my notes saved automatically?",
    a: "Yes. Your note saves shortly after you stop typing. The status above the editor shows Saving changes, All changes saved, or Could not save changes.",
  },
  {
    q: "What can the AI assistant do?",
    a: "Summary condenses your note, Quiz creates a 5-question multiple-choice quiz, and Ask AI answers a question about your note. Each one needs some written text in the note first.",
  },
  {
    q: "The AI request failed. What should I do?",
    a: "Wait a moment and try again. Make sure your note contains text, and for Ask AI that you typed a question. If the error keeps appearing, send us a message below with what you were doing.",
  },
  {
    q: "How do I delete my account or reset my password?",
    a: "Send us a message with the topic Account and the email you signed up with, and we’ll help you.",
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#F8F5ED] text-[#353B2E]">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10">

        {/* Header */}
        <header className="mb-12 border-b border-[#DED5C5] pb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#667653]">
            Support Center
          </span>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            How can we help?
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#353B2E]/65 sm:text-base">
            Find a quick answer below, or send us a message and we’ll get back
            to you.
          </p>
        </header>

        {/* Getting Started */}
        <section aria-labelledby="start-heading" className="mb-16">
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#795C42]">
              Your first steps
            </span>

            <h2
              id="start-heading"
              className="mt-2 text-xl font-semibold tracking-tight"
            >
              Getting started
            </h2>

            <p className="mt-1 text-sm text-[#353B2E]/60">
              Four steps from an empty workspace to your first quiz.
            </p>
          </div>

          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative overflow-hidden rounded-xl border bg-white p-4 pt-5 transition duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{
                  borderColor: `${step.color}50`,
                }}
              >
                <span
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ backgroundColor: step.color }}
                />

                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: step.color }}
                >
                  {index + 1}
                </span>

                <h3 className="mt-4 text-sm font-semibold text-[#353B2E]">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#353B2E]/65">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mb-16">
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#795C42]">
              Need an answer?
            </span>

            <h2
              id="faq-heading"
              className="mt-2 text-xl font-semibold tracking-tight"
            >
              Frequently asked questions
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#DED5C5] bg-white divide-y divide-[#DED5C5]">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group open:bg-[#F8F5ED]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-sm font-semibold text-[#353B2E] transition-colors hover:bg-[#F8F5ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#667653] [&::-webkit-details-marker]:hidden">
                  {item.q}

                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-[#667653] transition-transform duration-200 group-open:rotate-45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>

                <p className="px-5 pb-5 text-sm leading-7 text-[#353B2E]/70">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="mx-auto w-full max-w-2xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-[#DED5C5] bg-white p-5 pt-7 shadow-sm sm:p-8 sm:pt-9">
            <span className="absolute inset-x-0 top-0 h-[3px] bg-[#667653]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#795C42]">
              We're here to help
            </span>

            <h2
              id="contact-heading"
              className="mt-2 text-xl font-semibold tracking-tight"
            >
              Send us a message
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#353B2E]/60">
              {RESPONSE_TIME}
            </p>

            <SupportForm />
          </div>
        </section>

      </div>
    </main>
  );
}