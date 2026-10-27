
"use client";

import React from "react";
import Link from "next/link";

const ArrowRightIcon = ({
  className = "h-4 w-4",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);

type Feature = {
  title: string;
  body: string;
  color: string;
  background: string;
  border: string;
};

const FEATURES: Feature[] = [
  {
    title: "Create Your Subjects",
    body: "Organize everything you study in one workspace.",
    color: "#F72585",
    background: "rgba(247,37,133,0.12)",
    border: "rgba(247,37,133,0.35)",
  },
  {
    title: "Add Topics",
    body: "Break every subject into clear, manageable topics.",
    color: "#FACC15",
    background: "rgba(250,204,21,0.10)",
    border: "rgba(250,204,21,0.32)",
  },
  {
    title: "Write Your Notes",
    body: "Keep your notes organized and easy to find.",
    color: "#4CC9A0",
    background: "rgba(76,201,160,0.11)",
    border: "rgba(76,201,160,0.32)",
  },
  {
    title: "Learn With AI",
    body: "Summarize lessons, generate quizzes, and ask questions.",
    color: "#A78BFA",
    background: "rgba(167,139,250,0.13)",
    border: "rgba(167,139,250,0.35)",
  },
];

function FeatureCard({
  feature,
  step,
}: {
  feature: Feature;
  step: number;
}) {
  return (
    <article
      className="feature-card relative flex h-[94px] min-w-0 flex-col justify-center overflow-hidden rounded-xl border px-3 py-2.5 sm:h-[100px] sm:px-3.5"
      style={{
        backgroundColor: feature.background,
        borderColor: feature.border,
      }}
    >
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: feature.color }}
      />

      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold"
          style={{
            color: feature.color,
            backgroundColor: "rgba(255,255,255,0.10)",
          }}
        >
          0{step}
        </span>

        <h3 className="text-xs font-bold leading-snug text-white sm:text-[13px]">
          {feature.title}
        </h3>
      </div>

      <p className="mt-1.5 pl-9 text-[10px] leading-relaxed text-white/70 sm:text-[11px]">
        {feature.body}
      </p>
    </article>
  );
}

export default function PrognitionPage() {
  return (
    <main className="prognition-page animated-gradient relative flex min-h-[100svh] flex-col overflow-hidden text-white lg:h-[100svh] lg:min-h-[600px]">
      <style>{`
        .animated-gradient {
          background: linear-gradient(
            180deg,
            #360099 0%,
            #21005e 48%,
            #000000 100%
          );
          background-color: #000000;
          isolation: isolate;
        }

        .animated-gradient::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(54, 0, 153, 0.16) 0%,
            rgba(33, 0, 94, 0.05) 45%,
            transparent 75%
          );
          opacity: 0.4;
          animation: subtlePurplePulse 8s ease-in-out infinite alternate;
        }

        @keyframes subtlePurplePulse {
          from {
            opacity: 0.25;
          }
          to {
            opacity: 0.65;
          }
        }

        .primary-cta {
          box-shadow: 0 7px 24px rgba(247, 37, 133, 0.22);
          transition: background-color 200ms ease, box-shadow 200ms ease;
        }

        .primary-cta:hover {
          box-shadow: 0 8px 25px rgba(247, 37, 133, 0.32);
        }

        .feature-card {
          transition: border-color 200ms ease;
        }

        .feature-card:hover {
          border-color: rgba(255, 255, 255, 0.45);
        }

        @media (min-width: 768px) {
          .hero-main-content {
            padding-top: 20px;
            padding-bottom: 8px;
          }

          .hero-content {
            gap: 15px;
          }

          .hero-heading {
            font-size: clamp(36px, 4.2vw, 58px);
          }

          .hero-description {
            line-height: 1.65;
          }

          .feature-area {
            padding-bottom: 44px;
          }
        }

        @media (min-width: 768px) and (max-height: 760px) {
          .hero-main-content {
            padding-top: 10px;
            padding-bottom: 6px;
          }

          .hero-content {
            gap: 11px;
          }

          .hero-heading {
            font-size: clamp(32px, 3.8vw, 48px);
          }

          .hero-description {
            font-size: 12px;
            line-height: 1.5;
          }

          .feature-area {
            padding-bottom: 28px;
          }

          .feature-card {
            height: 88px;
          }
        }

        @media (max-width: 767px) {
          .hero-main-content {
            padding-top: 30px;
            padding-bottom: 20px;
          }

          .hero-content {
            gap: 15px;
          }

          .feature-area {
            padding-bottom: 32px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animated-gradient::before {
            animation: none;
            opacity: 0.4;
          }

          .primary-cta,
          .feature-card {
            transition: none !important;
          }
        }
      `}</style>

      {/* Hero and feature cards */}
      <section
        id="home"
        className="relative z-10 flex flex-1 flex-col"
      >
        {/* Hero content */}
        <div className="hero-main-content flex flex-1 items-center justify-center px-5 pb-4 pt-5 sm:px-8 sm:pb-4 sm:pt-6">
          <div className="hero-content mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
            {/* Main heading */}
            <h1 className="hero-heading max-w-3xl text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Your AI Workspace for{" "}
              <span className="whitespace-nowrap text-[#FACC15]">
                Learning
              </span>
            </h1>

            {/* Description */}
            <p className="hero-description max-w-xl text-xs leading-6 text-white/75 sm:text-sm sm:leading-7">
              Learn smarter, stay organized, and get more done.
              Prognition brings AI-powered learning, intelligent task
              management, and your personal knowledge into one focused
              workspace.
            </p>

            {/* Get Started button */}
            <div className="flex w-full items-center justify-center pt-0.5 sm:w-auto">
              <Link
                href="/learning"
                className="primary-cta group inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-full bg-[#F72585] px-7 py-2.5 text-xs font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15] focus-visible:ring-offset-2 focus-visible:ring-offset-[#21005e] sm:w-auto sm:text-sm"
              >
                Get Started
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div
          id="features"
          className="feature-area relative w-full px-4 pb-8 sm:px-7 lg:px-10"
        >
          <p className="mb-2.5 text-center text-[9px] font-bold uppercase tracking-[0.22em] text-white/50 sm:mb-3 sm:text-[10px]">
            Everything you need in one place
          </p>

          {/* Desktop: four cards in one row */}
          <div className="mx-auto hidden max-w-6xl grid-cols-4 gap-3 md:grid lg:gap-4">
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                step={index + 1}
              />
            ))}
          </div>

          {/* Mobile: responsive cards */}
          <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                step={index + 1}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
