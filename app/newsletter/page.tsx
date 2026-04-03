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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12">
            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You are subscribed!</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Thanks for signing up. We will be in touch with local trades news, home tips, and the latest listings across the CV area.
            </p>
            <a href="/" className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4">
            Stay informed
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            The CV Trades Newsletter
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            Local trades news, home improvement tips, new listings and exclusive offers
            delivered straight to your inbox. No spam, ever.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">What you will get</h2>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Local trades news</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">What is happening in the Coventry and Warwickshire trades industry.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Home improvement tips</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Practical guides to help you get the most out of your home projects.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">New listings</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Be the first to know about new tradespeople joining the directory.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Exclusive offers</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Subscriber-only deals from tradespeople across the CV postcode area.</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="text-sm font-semibold text-blue-900 mb-1">Sent monthly</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                One newsletter per month. No spam, no daily emails, just useful local content when it matters.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Subscribe for free</h2>
              <p className="text-sm text-gray-500 mb-8">Join local homeowners across the CV area.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                    Your Name <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition"
                >
                  {submitting ? "Subscribing..." : "Subscribe to Newsletter"}
                </button>

                <p className="text-center text-xs text-gray-400">
                  By subscribing you agree to our{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                  . Unsubscribe any time.
                </p>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">Free</p>
                  <p className="text-xs text-gray-500 mt-0.5">Always free</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">1x</p>
                  <p className="text-xs text-gray-500 mt-0.5">Per month</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-xs text-gray-500 mt-0.5">Spam emails</p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
                Back to home
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}