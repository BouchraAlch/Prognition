
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signInWithGoogle } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const INPUT =
  "w-full rounded-lg border border-[#DED5C5] bg-[#F8F5ED] px-3.5 py-3 text-sm text-[#353B2E] outline-none transition duration-200 placeholder:text-[#353B2E]/40 focus:border-[#667653] focus:bg-white focus:ring-2 focus:ring-[#667653]/15";

const LABEL = "mb-1.5 block text-xs font-semibold text-[#353B2E]";

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 18 18"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.3441 0-4.3282-1.5832-5.0359-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.9641 10.71c-.18-.54-.2823-1.1168-.2823-1.71s.1023-1.17.2823-1.71V4.9582H.9574A8.9965 8.9965 0 0 0 0 9c0 1.4523.3477 2.8268.9574 4.0418L3.9641 10.71z"
      />
      <path
        fill="#EA4335"
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.9641 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z"
      />
    </svg>
  );
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const busy = loading || googleLoading;

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage(
        "Account created successfully. Check your email to confirm your account."
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-start justify-center bg-[#F8F5ED] px-5 pb-16 pt-24 sm:pt-28">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#667653]">
            Start your journey
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#353B2E] sm:text-4xl">
            Create your account
          </h1>

          <p className="mt-3 text-sm text-[#353B2E]/60">
            Start learning and organizing with{" "}
            <span className="font-bold text-[#667653]">
              Prognition
            </span>
          </p>
        </div>

        {/* Signup Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#DED5C5] bg-white p-6 pt-8 shadow-xl shadow-[#353B2E]/[0.05] sm:p-8 sm:pt-10">

          {/* Demo Account Invitation */}
          <div className="mb-5 rounded-2xl border border-[#667653]/25 bg-[#F8F5ED] p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-[#353B2E]">
                Just exploring Prognition?
              </p>

              <span className="shrink-0 rounded-full bg-[#667653]/10 px-2.5 py-1 text-[10px] font-bold text-[#526344]">
                DEMO
              </span>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-[#353B2E]/65">
              Explore the platform using our demo account.
              It already contains learning materials so you can
              try the AI features without creating an account.
            </p>

            <Link
              href="/login"
              className="mt-3 flex w-full items-center justify-center rounded-full border border-[#667653] px-4 py-2.5 text-sm font-semibold text-[#526344] transition hover:bg-[#667653] hover:text-white"
            >
              Explore demo account →
            </Link>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={busy}
            className="flex min-h-11 w-full items-center justify-center gap-3 rounded-full border border-[#DED5C5] bg-white px-5 py-3 text-sm font-semibold text-[#353B2E] transition-colors duration-200 hover:border-[#667653] hover:bg-[#F8F5ED] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#667653] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#DED5C5]" />
            <span className="text-xs text-[#353B2E]/45">
              or use your email
            </span>
            <div className="h-px flex-1 bg-[#DED5C5]" />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="fullName" className={LABEL}>
                Full name
              </label>

              <input
                id="fullName"
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="signup-email" className={LABEL}>
                Email
              </label>

              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="signup-password" className={LABEL}>
                Password
              </label>

              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={INPUT}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-center text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="rounded-lg border border-[#667653]/30 bg-[#667653]/10 px-3 py-2.5 text-center text-sm text-[#353B2E]"
              >
                {message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="flex min-h-11 w-full items-center justify-center rounded-full bg-[#667653] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(102,118,83,0.20)] transition duration-200 hover:bg-[#526344] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#667653] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-[#353B2E]/65">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#667653] underline-offset-4 hover:text-[#526344] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#667653]"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Support */}
        <p className="mt-6 text-center text-xs text-[#353B2E]/45">
          Need help?{" "}
          <Link
            href="/support"
            className="font-medium text-[#526344] underline-offset-4 hover:underline"
          >
            Contact support
          </Link>
        </p>
      </div>
    </main>
  );
}
