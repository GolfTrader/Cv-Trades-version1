'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const [helpOpen, setHelpOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative z-50 border-b border-slate-100 bg-white/70 backdrop-blur">
      <div className="container-page flex items-center justify-between py-5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-md" style={{background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"}}>
            <span className="text-base font-black tracking-tight">CV</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Trades<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="transition hover:text-slate-900">
            Home
          </Link>
          <Link href="/faq" className="transition hover:text-slate-900">
            FAQ
          </Link>

          {/* Help with your project dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className="flex items-center gap-1 transition hover:text-slate-900"
            >
              Help with your project
              <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${helpOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {helpOpen && (
              <div className="absolute left-0 top-full z-[100] mt-2 w-52 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl">
                <Link
                  href="/building-control"
                  onClick={() => setHelpOpen(false)}
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  🏗️ Building Control
                </Link>
                <Link
                  href="/planning-application"
                  onClick={() => setHelpOpen(false)}
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  📋 Planning Application
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/advertise" className="btn-primary text-sm px-5 py-2.5">
            Tradesperson Signup
          </Link>
        </div>
      </div>
    </header>
  );
}
