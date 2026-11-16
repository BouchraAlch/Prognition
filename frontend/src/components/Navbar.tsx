
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

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

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
     COLORS
  ========================= */

  const navbarBackground = isHomePage
    ? "bg-[#F3EBDD]/85 border-[#DED5C5]/70 backdrop-blur-md"
    : "bg-[#F3EBDD]/95 border-[#DED5C5] backdrop-blur-xl";

  const navTextColor = "text-[#353B2E]";

  const navLinkColor =
    "text-[#68675B] hover:text-[#667653]";

  const navBorderColor =
    "border-[#B9A68D] hover:border-[#667653]";

  const loginButtonColor =
    "bg-[#1F1F1B] text-white hover:bg-[#353B2E] shadow-sm";

  const signupButtonColor =
    "bg-transparent text-[#795C42] border border-[#B9A68D] hover:bg-[#EAE3D5] hover:border-[#795C42]";

  const profileButtonColor =
    "border border-[#D9CFBD] bg-[#EAE3D5] text-[#667653] hover:bg-[#E2DACB] hover:border-[#667653]";

  const mobileMenuButtonColor =
    "text-[#353B2E] border-[#DED5C5] bg-[#F8F5ED] hover:bg-[#EAE3D5]";

  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#667653] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3EBDD]";

  /* =========================
     RENDER
  ========================= */

  return (
    <header
      className={`
        fixed top-9 left-0 right-0 z-50
        border-b transition-all duration-300
        ${navbarBackground}
        ${scrolled ? "shadow-sm" : ""}
      `}
    >
      <div
        className={`
          mx-auto flex max-w-6xl items-center justify-between px-5
          transition-all duration-300
          ${scrolled ? "py-1" : "py-1.5"}
        `}
      >
        {/* LOGO */}

        <Link
          href="/"
          className={`flex shrink-0 items-center rounded-lg ${focusRing}`}
        >
          <img
            src="/logo.png"
            alt="Prognition"
            className="h-7 w-auto object-contain"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}

        <nav className="hidden items-center gap-8 md:flex">
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

        <div className="hidden items-center gap-3 md:flex">
          {!isLoggedIn ? (
            <>
              <Link
                href="/signup"
                className={`
                  rounded-full border px-4 py-1.5
                  text-xs font-semibold
                  transition-all duration-200
                  ${navTextColor}
                  ${navBorderColor}
                  ${signupButtonColor}
                  ${focusRing}
                `}
              >
                Sign Up
              </Link>

              <Link
                href="/login"
                className={`
                  group flex items-center gap-2
                  rounded-full px-5 py-1.5
                  text-xs font-semibold
                  transition-all duration-200
                  ${loginButtonColor}
                  ${focusRing}
                `}
              >
                <span>Log in</span>

                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          ) : (
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() =>
                  setProfileMenuOpen((open) => !open)
                }
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
                className={`
                  flex h-8 w-8 items-center justify-center
                  rounded-full border transition-all duration-200
                  ${profileButtonColor}
                  ${focusRing}
                `}
              >
                <ProfileIcon className="h-4 w-4" />
              </button>

              {profileMenuOpen && (
                <div
                  className="
                    absolute right-0 top-10 w-48
                    rounded-xl border border-[#DED5C5]
                    bg-[#F8F5ED] p-1.5
                    text-[#353B2E]
                    shadow-lg shadow-[#4B3D2B]/10
                  "
                >
                  <Link
                    href="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="
                      flex w-full items-center gap-2.5
                      rounded-lg px-3 py-2.5
                      text-sm font-medium
                      text-[#68675B]
                      transition-colors
                      hover:bg-[#EAE3D5]
                      hover:text-[#667653]
                    "
                  >
                    <SettingsIcon />
                    <span>Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex w-full items-center gap-2.5
                      rounded-lg px-3 py-2.5
                      text-sm font-medium
                      text-[#98604F]
                      transition-colors
                      hover:bg-[#F0E4DA]
                    "
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

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((open) => !open)
            }
            className={`
              rounded-lg border p-1.5
              transition-all duration-200
              ${mobileMenuButtonColor}
              ${focusRing}
            `}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <CloseIcon className="h-4 w-4" />
            ) : (
              <MenuIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}

      {mobileMenuOpen && (
        <div
          className="
            absolute left-0 right-0 top-full
            border-b border-[#DED5C5]
            bg-[#F3EBDD]/98 px-5 py-4
            text-[#353B2E]
            shadow-lg shadow-[#4B3D2B]/5
            backdrop-blur-xl
            md:hidden
          "
        >
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="
                rounded-lg px-3 py-3
                text-sm font-semibold
                text-[#68675B]
                transition-colors
                hover:bg-[#EAE3D5]
                hover:text-[#667653]
              "
            >
              Home
            </Link>

            <Link
              href="/learning"
              onClick={() => setMobileMenuOpen(false)}
              className="
                rounded-lg px-3 py-3
                text-sm font-semibold
                text-[#68675B]
                transition-colors
                hover:bg-[#EAE3D5]
                hover:text-[#667653]
              "
            >
              Learning hub
            </Link>

            <a
              href={isHomePage ? "#workspaces" : "/#workspaces"}
              onClick={() => setMobileMenuOpen(false)}
              className="
                rounded-lg px-3 py-3
                text-sm font-semibold
                text-[#68675B]
                transition-colors
                hover:bg-[#EAE3D5]
                hover:text-[#667653]
              "
            >
              Workspaces
            </a>

            <Link
              href="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="
                rounded-lg px-3 py-3
                text-sm font-semibold
                text-[#68675B]
                transition-colors
                hover:bg-[#EAE3D5]
                hover:text-[#667653]
              "
            >
              Support
            </Link>
          </nav>

          {/* MOBILE AUTHENTICATION */}

          <div className="mt-3 flex flex-col space-y-2 border-t border-[#DED5C5] pt-4">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    w-full rounded-full border
                    border-[#B9A68D]
                    py-3 text-center
                    text-xs font-semibold
                    text-[#795C42]
                    transition-colors
                    hover:bg-[#EAE3D5]
                  "
                >
                  Sign Up
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    w-full rounded-full py-3
                    text-center text-xs font-semibold
                    transition-colors
                    ${loginButtonColor}
                  `}
                >
                  Log in
                </Link>
              </>
            ) : (
              <>
                <div
                  className="
                    flex items-center gap-3
                    rounded-xl border border-[#DED5C5]
                    bg-[#F8F5ED] p-3
                  "
                >
                  <span
                    className="
                      flex h-10 w-10 items-center justify-center
                      rounded-full border border-[#D9CFBD]
                      bg-[#EAE3D5] text-[#667653]
                    "
                  >
                    <ProfileIcon className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-[#353B2E]">
                      Your account
                    </p>

                    <p className="text-xs text-[#777467]">
                      Signed in
                    </p>
                  </div>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    flex w-full items-center justify-center gap-2
                    rounded-full border border-[#B9A68D]
                    bg-transparent py-3
                    text-xs font-semibold text-[#795C42]
                    transition-colors hover:bg-[#EAE3D5]
                  "
                >
                  <SettingsIcon />
                  Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex w-full items-center justify-center gap-2
                    rounded-full bg-[#F0E4DA] py-3
                    text-xs font-semibold text-[#98604F]
                    transition-colors hover:bg-[#E9D7CA]
                  "
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
