"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/* =========================
   ICONS
========================= */

const ArrowRightIcon = ({
  className = "w-3.5 h-3.5",
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

const MenuIcon = ({
  className = "w-5 h-5",
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
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const CloseIcon = ({
  className = "w-5 h-5",
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ProfileIcon = ({
  className = "w-5 h-5",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="3.5" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5"
    />
  </svg>
);

const SettingsIcon = ({
  className = "w-4 h-4",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-.826 3.31-2.37 2.37a1.724 1.724 0 001.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const LogoutIcon = ({
  className = "w-4 h-4",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 15l3-3m0 0l-3-3m3 3H9"
    />
  </svg>
);

/* =========================
   NAVBAR
========================= */

export default function Navbar() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === "/";

  /* =========================
     AUTHENTICATION
  ========================= */

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let mounted = true;

    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session check error:", error.message);
        return;
      }

      if (mounted) {
        setIsLoggedIn(!!session);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setIsLoggedIn(!!session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =========================
     SCROLL DETECTION
  ========================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================
     CLOSE MENUS ON NAVIGATION
  ========================= */

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  /* =========================
     CLOSE PROFILE DROPDOWN
  ========================= */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    setIsLoggedIn(false);
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);

    window.location.href = "/";
  };

  /* =========================
     THEME COLORS
  ========================= */

  // Home page: dark glass over the purple hero.
  // Every other page: white bar with deep-purple (#240765) ink.
  // Accents: pink #F72585, yellow #FACC15, purple #3A0CA3 / #7209B7.

  const navbarBackground = isHomePage
    ? "bg-black/25 border-white/10 backdrop-blur-md"
    : "bg-white/95 border-[#E6DDF8] backdrop-blur-xl";

  const navTextColor = isHomePage ? "text-white" : "text-[#240765]";

  const navLinkColor = isHomePage
    ? "text-white/90 hover:text-[#FACC15]"
    : "text-[#240765]/75 hover:text-[#F72585]";

  const navBorderColor = isHomePage
    ? "border-white/40 hover:border-[#FACC15]"
    : "border-[#240765]/20 hover:border-[#F72585]";

  // Yellow CTA on both themes, same as "New Subject" in the app.
  const loginButtonColor = isHomePage
    ? "bg-[#FACC15] text-[#240765] hover:bg-[#FFE066] shadow-[0_4px_16px_rgba(250,204,21,0.20)]"
    : "bg-[#FACC15] text-[#240765] hover:bg-[#FFE066] shadow-[0_4px_16px_rgba(250,204,21,0.30)]";

  const signupButtonColor = isHomePage
    ? "bg-white/5 text-white border border-white/40 hover:bg-[#F72585]/15 hover:border-[#F72585]"
    : "bg-gradient-to-r from-[#3A0CA3] to-[#7209B7] text-white shadow-[0_4px_14px_rgba(114,9,183,0.30)] hover:from-[#F72585] hover:to-[#7209B7]";

  const profileButtonColor = isHomePage
    ? "border border-[#FACC15]/60 bg-gradient-to-br from-[#3A0CA3] to-[#7209B7] text-[#FACC15] shadow-[0_0_18px_rgba(247,37,133,0.22)] hover:border-[#FACC15] hover:shadow-[0_0_22px_rgba(250,204,21,0.20)]"
    : "border border-[#3A0CA3]/25 bg-gradient-to-br from-[#3A0CA3]/[0.08] to-[#F72585]/[0.08] text-[#240765] shadow-[0_4px_18px_rgba(36,7,101,0.10)] hover:border-[#F72585]/50 hover:shadow-[0_4px_20px_rgba(247,37,133,0.18)]";

  const mobileMenuButtonColor = isHomePage
    ? "text-white border-white/30 bg-black/20 hover:bg-[#F72585]/20 hover:border-[#FACC15]/70"
    : "text-[#240765] border-[#240765]/20 bg-[#240765]/[0.04] hover:border-[#F72585]";

  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

  /* =========================
     RENDER
  ========================= */

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        navbarBackground
      } ${scrolled ? "py-2.5" : "py-4"}`}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className={`flex items-center shrink-0 rounded-lg ${focusRing}`}>
          <img
            src="/logo.png"
            alt="Prognition"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-xs font-semibold transition-colors ${navLinkColor} ${focusRing}`}
          >
            Home
          </Link>

          <Link
            href="/learning"
            className={`text-xs font-semibold transition-colors ${navLinkColor} ${focusRing}`}
          >
            Learning hub
          </Link>

          <Link
            href="/support"
            className={`text-xs font-semibold transition-colors ${navLinkColor} ${focusRing}`}
          >
            Support
          </Link>
        </nav>

        {/* DESKTOP RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link
                href="/signup"
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${navTextColor} ${navBorderColor} ${focusRing} ${
                  isHomePage
                    ? "hover:bg-[#F72585]/10"
                    : "hover:bg-[#F72585]/[0.07]"
                }`}
              >
                Sign Up
              </Link>

              <Link
                href="/login"
                className={`group px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${loginButtonColor} ${focusRing}`}
              >
                <span>Log in</span>
                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          ) : (
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
                className={`relative w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden transition-all duration-200 ${profileButtonColor} ${focusRing}`}
              >
                <span
                  className="absolute inset-0 rounded-full blur-md bg-gradient-to-br from-[#FACC15]/35 via-[#F72585]/30 to-[#7209B7]/40"
                />

                <span
                  className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#3A0CA3] via-[#560BAD] to-[#7209B7]"
                />

                <ProfileIcon className="relative z-10 w-5 h-5 text-[#FACC15] drop-shadow-[0_0_6px_rgba(250,204,21,0.55)]" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-2xl border border-[#E6DDF8] bg-white shadow-xl shadow-[#240765]/15 p-1.5 text-[#240765]">
                  <Link
                    href="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#240765] hover:bg-[#F72585]/10 hover:text-[#7209B7] transition-colors"
                  >
                    <SettingsIcon />
                    <span>Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogoutIcon />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`p-2 rounded-xl border backdrop-blur-xl transition-all duration-200 ${mobileMenuButtonColor} ${focusRing}`}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-[#E6DDF8] px-5 py-4 space-y-3 shadow-[0_16px_30px_rgba(36,7,101,0.10)] text-[#240765]">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold py-3 px-3 rounded-xl hover:bg-[#F72585]/10 hover:text-[#7209B7] transition-colors"
            >
              Home
            </Link>

            <Link
              href="/learning"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold py-3 px-3 rounded-xl hover:bg-[#F72585]/10 hover:text-[#7209B7] transition-colors"
            >
              Learning hub
            </Link>

            <a
              href={isHomePage ? "#workspaces" : "/#workspaces"}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold py-3 px-3 rounded-xl hover:bg-[#F72585]/10 hover:text-[#7209B7] transition-colors"
            >
              Workspaces
            </a>

            <Link
              href="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold py-3 px-3 rounded-xl hover:bg-[#F72585]/10 hover:text-[#7209B7] transition-colors"
            >
              Support
            </Link>
          </nav>

          {/* MOBILE AUTHENTICATION */}
          <div className="pt-4 border-t border-[#E6DDF8] flex flex-col space-y-2">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-xs font-bold py-3 rounded-full text-center transition-all duration-200 ${
                    isHomePage
                      ? "bg-[#F72585] text-white hover:bg-[#D91A70]"
                      : signupButtonColor
                  }`}
                >
                  Sign Up
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-xs font-bold py-3 rounded-full text-center transition-colors ${loginButtonColor}`}
                >
                  Log in
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 rounded-xl border border-[#F72585]/20 bg-gradient-to-r from-[#3A0CA3]/[0.05] to-[#F72585]/[0.06] p-3">
                  <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#FACC15]/60 bg-gradient-to-br from-[#3A0CA3] via-[#560BAD] to-[#7209B7] shadow-[0_0_18px_rgba(247,37,133,0.18)]">
                    <ProfileIcon className="w-5 h-5 text-[#FACC15]" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-[#240765]">
                      Your account
                    </p>
                    <p className="text-xs text-[#240765]/60">Signed in</p>
                  </div>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 border border-[#240765]/15 bg-[#240765]/[0.03] text-xs font-bold text-[#240765] py-3 rounded-full hover:bg-[#F72585]/[0.07] hover:border-[#F72585]/30 transition-colors"
                >
                  <SettingsIcon />
                  Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 text-xs font-bold py-3 rounded-full hover:bg-red-100 transition-colors"
                >
                  <LogoutIcon />
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
