"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

function NavigationIcon({ type }) {
  const paths = {
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    dashboard: (
      <>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19V3" />
      </>
    ),
    signOut: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[type]}
    </svg>
  );
}

export default function ProfileNavigation({ username }) {
  return (
    <aside className="rounded-2xl border border-coffee-border bg-warm-white p-3 shadow-sm lg:p-4">
      <nav aria-label="Creator profile" className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:flex-col">
        <Link
          aria-current="page"
          className="flex items-center gap-3 rounded-xl bg-latte px-4 py-3 font-semibold text-espresso transition-colors hover:bg-soft-latte"
          href={`/${encodeURIComponent(username)}`}
        >
          <NavigationIcon type="profile" />
          <span>My Profile</span>
        </Link>

        <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-mocha">
          <NavigationIcon type="dashboard" />
          <div className="min-w-0">
            <p className="font-medium">Dashboard</p>
            <span className="mt-1 inline-flex rounded-full bg-latte px-2.5 py-1 text-[11px] font-semibold text-coffee">
              Under Development
            </span>
          </div>
        </div>
      </nav>

      <div className="my-4 border-t border-coffee-border lg:mt-6" />

      <button
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-mocha transition-colors hover:bg-latte hover:text-espresso focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee"
        onClick={() => signOut({ callbackUrl: "/signin" })}
        type="button"
      >
        <NavigationIcon type="signOut" />
        <span>Sign Out</span>
      </button>
    </aside>
  );
}
