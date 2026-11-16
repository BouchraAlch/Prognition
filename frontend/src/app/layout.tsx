
import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";

import "./globals.css";

export const metadata: Metadata = {
  title: "Orcadio - AI Workspace For Learning & Productivity",
  description:
    "Learn faster, stay organized, and achieve your goals with AI agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <style>{`
          .font-sans {
            font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif !important;
          }

          .font-display {
            font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
            letter-spacing: -0.02em;
          }

          /* Main surfaces */
          .surface-card {
            background: #F8F5ED;
            border: 1px solid #E5DCCB;
            box-shadow: 0 4px 16px rgba(75, 61, 43, 0.04);
          }

          /* Primary buttons */
          .btn-primary {
            background: #667653;
            color: #FFFFFF;
            transition: background 200ms ease;
          }

          .btn-primary:hover {
            background: #526344;
          }

          /* Secondary buttons */
          .btn-secondary {
            background: transparent;
            color: #795C42;
            border: 1px solid #B9A68D;
            transition: all 200ms ease;
          }

          .btn-secondary:hover {
            background: #EAE3D5;
            border-color: #795C42;
          }

          /* Global selection */
          ::selection {
            background: #667653;
            color: #FFFFFF;
          }

          /* Scrollbar */
          * {
            scrollbar-color: #B9A68D #F3EBDD;
            scrollbar-width: thin;
          }

          /* Portfolio notice animation */
          @keyframes portfolio-marquee {
            from {
              transform: translateX(100vw);
            }
            to {
              transform: translateX(-100%);
            }
          }

          .portfolio-marquee {
            width: max-content;
            animation: portfolio-marquee 24s linear infinite;
            will-change: transform;
          }

          @media (prefers-reduced-motion: reduce) {
            .portfolio-marquee {
              animation: none;
              transform: none;
              width: 100%;
              justify-content: center;
              white-space: normal;
              text-align: center;
            }
          }
        `}</style>
      </head>

      <body
        className="
          relative
          min-h-screen
          w-full
          bg-[#F3EBDD]
          text-[#353B2E]
          font-sans
          antialiased
          selection:bg-[#667653]
          selection:text-white
          overflow-x-hidden
        "
      >
        {/* PORTFOLIO NOTICE BAR */}
        <div
          className="
            fixed
            top-0
            left-0
            z-[60]
            flex
            h-9
            w-full
            items-center
            overflow-hidden
            bg-[#795C42]
            text-[#F8F5ED]
          "
          role="status"
          aria-label="Portfolio project notice"
        >
          <div className="portfolio-marquee flex items-center whitespace-nowrap">
            <span className="px-8 text-[10px] font-medium tracking-[0.08em] sm:text-xs">
              PORTFOLIO PROJECT
              <span className="mx-3 text-[#D9C3A8]">•</span>
              Demonstration website showcasing AI-powered learning and
              productivity features.
              <span className="mx-3 text-[#D9C3A8]">•</span>
              Please avoid entering personal or sensitive information.
            </span>
          </div>
        </div>

        {/* NAVBAR */}
        <div className="relative z-20">
          <Navbar />
        </div>

        {/* PAGE CONTENT */}
        <main className="relative z-10">
          {children}
        </main>

        {/* FOOTER */}
        <div className="relative z-20">
          <ConditionalFooter />
        </div>
      </body>
    </html>
  );
}
