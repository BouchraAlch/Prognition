import type { Metadata } from "next";
import { SupportForm } from "@/components/support/SupportForm";

export const metadata: Metadata = {
  title: "Support | Prognition",
  description: "Find answers, get started, or contact the Prognition team.",
};

const SUPPORT_EMAIL = "support@prognition.app";
const RESPONSE_TIME = "We usually reply within 24 hours.";

const STEPS = [
  {
    title: "Create a subject",
    body: "On the Learning page, select New Subject and add a title, cover image, and status.",
    color: "#F72585",
  },
  {
    title: "Add topics",
    body: "Open a subject and select New topic to break it into manageable parts.",
    color: "#FACC15",
  },
  {
    title: "Write your notes",
    body: "Pick a topic and start writing. Your changes save automatically.",
    color: "#4CC9A0",
  },
  {
    title: "Learn with AI",
    body: "Open AI assistant in a note to get a summary, a 5-question quiz, or answers to your questions.",
    color: "#A78BFA",
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
    <main className="min-h-screen bg-white text-[#240765]">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10">
        {/* Header */}
        <header className="mb-12 border-b border-[#E6DDF8] pb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7209B7]">
            Support
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            How can we help?
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#240765]/60 sm:text-base">
            Find a quick answer below, or send us a message and we’ll get back
            to you.
          </p>
        </header>

        {/* Getting started */}
        <section aria-labelledby="start-heading" className="mb-14">
          <h2 id="start-heading" className="text-xl font-bold tracking-tight">
            Getting started
          </h2>

          <p className="mt-1 text-sm text-[#240765]/60">
            Four steps from an empty workspace to your first quiz.
          </p>

          <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative overflow-hidden rounded-xl border p-4 pt-5"
                style={{
                  backgroundColor: `${step.color}1A`,
                  borderColor: `${step.color}59`,
                }}
              >
                <span
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ backgroundColor: step.color }}
                />

                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/80 text-xs font-extrabold text-[#240765]">
                  {index + 1}
                </span>

                <h3 className="mt-3 text-sm font-bold">{step.title}</h3>

                <p className="mt-1.5 text-xs leading-5 text-[#240765]/65">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mb-14">
          <h2 id="faq-heading" className="text-xl font-bold tracking-tight">
            Frequently asked questions
          </h2>

          <div className="mt-6 divide-y divide-[#E6DDF8] overflow-hidden rounded-2xl border border-[#E6DDF8]">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group bg-white open:bg-[#FAF7FF]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold transition-colors hover:bg-[#FAF7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FACC15] [&::-webkit-details-marker]:hidden">
                  {item.q}

                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-[#F72585] transition-transform duration-200 group-open:rotate-45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>

                <p className="px-5 pb-5 text-sm leading-6 text-[#240765]/70">
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
          <div className="relative overflow-hidden rounded-2xl border border-[#E6DDF8] bg-white p-5 pt-6 sm:p-7 sm:pt-8">
            <span className="absolute inset-x-0 top-0 h-[3px] bg-[#F72585]" />

            <h2
              id="contact-heading"
              className="text-xl font-bold tracking-tight"
            >
              Send us a message
            </h2>

            <p className="mt-1 text-sm text-[#240765]/60">
              {RESPONSE_TIME}
            </p>

            <SupportForm />
          </div>
        </section>
      </div>
    </main>
  );
}