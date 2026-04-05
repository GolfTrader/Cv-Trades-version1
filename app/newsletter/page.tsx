"use client";

import { useState } from "react";

export default function NewsletterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email address."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20l8 8 14-14" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">You are subscribed!</h1>
          <p className="text-slate-300 text-base leading-relaxed mb-10 max-w-sm mx-auto">
            Thanks for signing up. We will send you local trades news, home tips, and the latest listings across the CV area.
          </p>
          <a href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-bold rounded-xl text-base hover:bg-slate-100 transition-colors">
            Back to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[80px] rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative py-16 md:py-20">
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-slate-600">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-slate-300">Newsletter</span>
          </nav>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/20 px-4 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-semibold text-blue-300 uppercase tracking-wide">Free to subscribe</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              The CV Trades<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Newsletter
              </span>
            </h1>

            <p className="mt-5 text-slate-300 text-lg leading-relaxed max-w-xl">
              Local trades news, home improvement tips, and new listings delivered straight to your inbox. One email a month. No spam, ever.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: subscribe form */}
          <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-8 sm:p-10 order-1">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Subscribe for free</h2>
            <p className="text-base text-slate-500 mb-8">Join homeowners across Coventry and Warwickshire.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your name <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10 transition-all"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-medium">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit as any}
                disabled={submitting}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-lg font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                      <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Subscribing...
                  </span>
                ) : "Subscribe to Newsletter"}
              </button>

              <p className="text-center text-sm text-slate-400">
                By subscribing you agree to our{" "}
                <a href="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>.
                Unsubscribe anytime.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 pt-7 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
              {[
                { value: "Free", label: "Always free" },
                { value: "1x", label: "Per month" },
                { value: "0", label: "Spam emails" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-blue-600">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: what you get */}
          <div className="order-2 space-y-5">
            <h2 className="text-2xl font-black text-slate-900 mb-1">What you will get</h2>
            <p className="text-base text-slate-500 mb-6">Useful content for homeowners in the CV postcode area.</p>

            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-blue-600">
                    <rect x="3" y="3" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 8h8M7 11h8M7 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                bg: "bg-blue-50",
                title: "Local trades news",
                desc: "What is happening in the Coventry and Warwickshire trades industry.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-emerald-600">
                    <path d="M3 13l2-2m0 0l7-7 7 7M5 11v8a1 1 0 001 1h4m6-9l2 2m-2-2v8a1 1 0 01-1 1h-4m-2 0a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1m-6 0h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                bg: "bg-emerald-50",
                title: "Home improvement tips",
                desc: "Practical guides to help you get the most out of your home projects.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-amber-600">
                    <path d="M11 3l2 4 4.5.7-3.3 3.1.8 4.5L11 13.2l-4 2.1.8-4.5L4.5 7.7 9 7l2-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                ),
                bg: "bg-amber-50",
                title: "New listings",
                desc: "Be the first to know about new tradespeople joining the directory.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-rose-600">
                    <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                bg: "bg-rose-50",
                title: "Exclusive offers",
                desc: "Subscriber-only deals from tradespeople across the CV postcode area.",
              },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className={`h-11 w-11 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

            {/* Frequency callout */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-5 flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-blue-600">
                  <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M11 6v5l3.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-blue-900">Sent monthly</h3>
                <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                  One newsletter per month. No daily emails, just useful local content when it matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
