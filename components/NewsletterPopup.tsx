'use client';

import { useState, useEffect } from "react";

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("newsletter_popup_shown")) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem("newsletter_popup_shown", "1");
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

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
      setTimeout(() => setVisible(false), 2500);
    } catch (err: any) {
      setError(err.message === "Email already subscribed"
        ? "You are already subscribed!"
        : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[500] backdrop-blur-sm transition-opacity"
        onClick={() => setVisible(false)}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-[501] flex items-end sm:items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-400" />

          <div className="relative p-7 sm:p-8">
            {/* Close button */}
            <button
              onClick={() => setVisible(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Header */}
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Free newsletter</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Stay in the loop with CV Trades
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                New tradespeople in your area, home improvement tips, and seasonal guides for Coventry and Warwickshire homeowners.
              </p>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2 mt-5">
              {["New trades near you", "Seasonal tips", "Local news"].map(b => (
                <span key={b} className="inline-flex items-center gap-2 text-xs text-slate-300 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {b}
                </span>
              ))}
            </div>

            {/* Form */}
            <div className="mt-6">
              {submitted ? (
                <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="#34d399" strokeWidth="1.5"/>
                    <path d="M6 10l3 3 5-5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-emerald-400 font-bold">You are subscribed!</span>
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
                      className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-base font-bold px-6 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.98]"
                    >
                      {submitting ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                          <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                      ) : "Subscribe"}
                    </button>
                  </form>
                  {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                  <p className="mt-3 text-xs text-slate-500 text-center">
                    No spam. Unsubscribe anytime. Free forever.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
