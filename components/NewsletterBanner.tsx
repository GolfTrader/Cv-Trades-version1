'use client';

import { useState } from "react";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err.message === "Email already subscribed"
          ? "You are already subscribed!"
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* Left: text */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Free monthly newsletter</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Stay ahead of the local trades scene
            </h2>
            <p className="text-slate-400 text-base mt-2 leading-relaxed max-w-md">
              New listings, seasonal tips, and local trades news. One email a month, no spam.
            </p>
          </div>

          {/* Right: form */}
          <div className="w-full lg:w-auto lg:min-w-[380px]">
            {submitted ? (
              <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#34d399" strokeWidth="1.5"/>
                  <path d="M6 10l3 3 5-5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-emerald-400 font-bold text-base">You are subscribed!</span>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white placeholder-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-base font-bold px-7 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.98] whitespace-nowrap"
                  >
                    {submitting ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                        <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    ) : "Subscribe free"}
                  </button>
                </form>
                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
                  {["500+ subscribers", "Once a month", "Unsubscribe anytime"].map(text => (
                    <div key={text} className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7l3 3 5-5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm text-slate-500">{text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
