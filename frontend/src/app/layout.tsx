
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
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

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
            letter-spacing: -0.01em;
          }

          .surface-card {
            background: #ffffff;
            border: 1px solid #ECECEC;
            box-shadow: 0 8px 24px -12px rgba(17, 17, 17, 0.06);
          }

          .btn-primary {
            background: #111111;
            color: #ffffff;
          }

          .btn-primary:hover {
            background: #000000;
          }

          .btn-secondary {
            background: transparent;
            color: #111111;
            border: 1.5px solid #111111;
          }

          .btn-secondary:hover {
            background: #111111;
            color: #ffffff;
          }
        `}</style>
      </head>

      <body
        className="
          relative
          min-h-screen
          w-full
          bg-[#F7F3EA]
          text-[#111111]
          font-sans
          antialiased
          selection:bg-black
          selection:text-white
          overflow-x-hidden
        "
      >
        <div className="relative z-20">
          <Navbar />
        </div>

        <main className="relative z-10 ">
          {children}
        </main>

        <div className="relative z-20">
          <ConditionalFooter />
        </div>
      </body>
    </html>
  );
}
