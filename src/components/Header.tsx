"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-xl dark:bg-gray-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-sm font-bold text-white shadow-lg shadow-orange-500/30">
            🔖
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent dark:from-amber-400 dark:via-orange-400 dark:to-rose-400">
            LinkStash
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400 md:flex">
          <Link href="/" className="transition hover:text-orange-600">Home</Link>
          <Link href="/#dashboard" className="transition hover:text-orange-600">Dashboard</Link>
          <Link href="/#features" className="transition hover:text-orange-600">Features</Link>
          <Link href="/privacy" className="transition hover:text-orange-600">Privacy</Link>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-white px-4 py-4 dark:bg-gray-950 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-gray-600 dark:text-gray-400">
            <Link href="/" onClick={() => setMenuOpen(false)} className="transition hover:text-orange-600">Home</Link>
            <Link href="/#dashboard" onClick={() => setMenuOpen(false)} className="transition hover:text-orange-600">Dashboard</Link>
            <Link href="/#features" onClick={() => setMenuOpen(false)} className="transition hover:text-orange-600">Features</Link>
            <Link href="/privacy" onClick={() => setMenuOpen(false)} className="transition hover:text-orange-600">Privacy</Link>
            <Link href="/terms" onClick={() => setMenuOpen(false)} className="transition hover:text-orange-600">Terms</Link>
          </nav>
        </div>
      )}
    </header>
  );
}