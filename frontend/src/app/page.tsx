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

export default function PrognitionPage() {
  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#1F1F1B] text-white">
      <style>{`
        .hero-background {
          background-image:
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.5) 0%,
              rgba(0, 0, 0, 0.55) 50%,
              rgba(0, 0, 0, 0.6) 100%
            ),
            url('/hero.jpg');
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .hero-text {
          text-shadow: 0 1px 12px rgba(0, 0, 0, 0.5);
        }

        .primary-cta {
          transition: background-color 200ms ease,
                      transform 200ms ease;
        }

        .primary-cta:hover {
          background-color: #526344;
          transform: translateY(-1px);
        }

        @media (prefers-reduced-motion: reduce) {
          .primary-cta {
            transition: none;
          }
        }
      `}</style>

      <section
        id="home"
        className="hero-background relative flex flex-1 flex-col"
      >
        {/* Hero content */}
        <div className="flex flex-1 items-center justify-center px-5 py-20 sm:px-8 sm:py-24">
          <div className="hero-text mx-auto flex w-full max-w-3xl flex-col items-center gap-5 text-center">

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Your personal learning space
            </span>

            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your AI Workspace for{" "}
              <span className="text-[#E6C9A8]">Learning.</span>
            </h1>

            <p className="max-w-lg text-sm leading-7 text-white/95 sm:text-base">
              Learn smarter, stay organized, and get more done.
              Prognition brings AI-powered learning, intelligent task
              management, and your personal knowledge into one focused
              workspace.
            </p>

            <div className="pt-2">
              <Link
                href="/learning"
                className="primary-cta group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#667653] px-7 py-3 text-base font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
              >
                Get Started
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}