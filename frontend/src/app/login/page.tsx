"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signInWithGoogle } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const INPUT =
  "w-full rounded-lg border border-[#E6DDF8] bg-[#FAF7FF] px-3.5 py-3 text-sm text-[#240765] outline-none transition duration-200 placeholder:text-[#240765]/35 focus:border-[#3A0CA3] focus:bg-white focus:ring-2 focus:ring-[#3A0CA3]/10";

const LABEL = "mb-1.5 block text-xs font-semibold text-[#240765]";

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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const busy = loading || googleLoading;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
    <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-start justify-center px-5 pb-16 pt-24 sm:pt-28">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#240765] sm:text-4xl">
            Welcome back
          </h1>

          <p className="mt-3 text-sm text-[#240765]/60">
            Log in to continue to{" "}
            <span className="font-bold text-[#7209B7]">Prognition</span>
          </p>
        </div>

        {/* Login card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#E6DDF8] bg-white p-6 pt-8 shadow-xl shadow-[#240765]/[0.06] sm:p-8 sm:pt-10">
          {/* Brand accent bar */}
          <div className="absolute inset-x-0 top-0 flex h-[3px]">
            <span className="flex-1 bg-[#F72585]" />
            <span className="flex-1 bg-[#FACC15]" />
            <span className="flex-1 bg-[#4CC9A0]" />
            <span className="flex-1 bg-[#A78BFA]" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={busy}
            className="flex min-h-11 w-full items-center justify-center gap-3 rounded-full border border-[#E6DDF8] bg-white px-5 py-3 text-sm font-semibold text-[#240765] transition-colors duration-200 hover:border-[#A78BFA] hover:bg-[#FAF7FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E6DDF8]" />
            <span className="text-xs text-[#240765]/45">or use your email</span>
            <div className="h-px flex-1 bg-[#E6DDF8]" />
          </div>

          {/* Email / Password form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className={LABEL}>
                Email
              </label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className={LABEL}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={INPUT}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-center text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {/* Log in */}
            <button
              type="submit"
              disabled={busy}
              className="flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#3A0CA3] to-[#7209B7] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(114,9,183,0.30)] transition duration-200 hover:from-[#F72585] hover:to-[#7209B7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Sign up */}
          <p className="mt-6 text-center text-sm text-[#240765]/65">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#7209B7] underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Support link */}
        <p className="mt-6 text-center text-xs text-[#240765]/45">
          Need help?{" "}
          <Link
            href="/support"
            className="font-medium text-[#240765]/65 underline-offset-4 hover:underline"
          >
            Contact support
          </Link>
        </p>
      </div>
    </main>
  );
}