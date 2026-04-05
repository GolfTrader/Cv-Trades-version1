'use client';

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10 transition-all";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-2";

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
            <span className="text-slate-300">Contact</span>
          </nav>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/20 px-4 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-semibold text-blue-300 uppercase tracking-wide">Get in touch</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              How can we<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                help you?
              </span>
            </h1>

            <p className="mt-5 text-slate-300 text-lg leading-relaxed max-w-xl">
              Have a question, need help, or want to list your business? We would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        {submitted ? (
          <div className="max-w-md mx-auto text-center">
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-10 sm:p-12">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M8 16l6 6 10-10" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Message sent!</h2>
              <p className="text-base text-slate-500 leading-relaxed mb-8">
                Thanks for getting in touch. We will get back to you at <strong className="text-slate-700">{form.email}</strong> as soon as possible.
              </p>
              <a href="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-base transition-all shadow-sm hover:shadow-md">
                Back to Homepage
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:gap-12 md:grid-cols-[280px_1fr]">

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Contact info card */}
              <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-7">
                <h2 className="text-lg font-bold text-slate-900 mb-5">Contact info</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue-600">
                        <rect x="2" y="4" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</p>
                      <a href="mailto:hello@cvtrades.co.uk" className="text-sm font-semibold text-blue-600 hover:underline mt-0.5 block">
                        hello@cvtrades.co.uk
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-emerald-600">
                        <path d="M10 2C6.7 2 4 4.7 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6z" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Coverage area</p>
                      <p className="text-sm text-slate-700 font-medium mt-0.5">CV Postcode Area</p>
                      <p className="text-sm text-slate-500">Coventry &amp; Warwickshire</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-amber-50 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-amber-600">
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M10 6v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Response time</p>
                      <p className="text-sm text-slate-700 font-medium mt-0.5">Within 1 business day</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick links card */}
              <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-7">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Quick links</h2>
                <ul className="space-y-3">
                  {[
                    { href: "/faq", label: "View our FAQ", icon: (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-blue-500">
                        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M7.5 7a1.5 1.5 0 013 0c0 1-1.5 1-1.5 2.5M9 12v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )},
                    { href: "/advertise", label: "Tradesperson Signup", icon: (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-emerald-500">
                        <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )},
                    { href: "/building-control", label: "Building Control Guide", icon: (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-amber-500">
                        <rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M6 7h6M6 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )},
                    { href: "/planning-application", label: "Planning Application", icon: (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-violet-500">
                        <path d="M4 3h7l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M11 3v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )},
                  ].map(link => (
                    <li key={link.href}>
                      <a href={link.href} className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors group">
                        <span className="flex-shrink-0">{link.icon}</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact form */}
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-7 sm:p-9">
              <div className="flex items-center gap-3 mb-7 pb-6 border-b border-slate-100">
                <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-slate-600">
                    <rect x="2" y="4" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Send us a message</h2>
                  <p className="text-sm text-slate-400">We will get back to you within one business day</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Your name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" value={form.name} onChange={e => update("name", e.target.value)}
                      placeholder="John Smith"
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Email address <span className="text-red-400">*</span>
                    </label>
                    <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                      placeholder="john@example.com"
                      className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Subject</label>
                  <select value={form.subject} onChange={e => update("subject", e.target.value)}
                    className={inputClass}>
                    <option value="">Select a topic...</option>
                    <option>Finding a tradesperson</option>
                    <option>List my business</option>
                    <option>Update my listing</option>
                    <option>Report a review</option>
                    <option>General enquiry</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea value={form.message} onChange={e => update("message", e.target.value)}
                    rows={6} placeholder="How can we help you?"
                    className={`${inputClass} resize-none`} />
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-medium">{error}</div>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-lg font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99]">
                  {submitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                        <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Sending...
                    </span>
                  ) : "Send Message"}
                </button>

                <p className="text-center text-sm text-slate-400">
                  Or email us directly at{" "}
                  <a href="mailto:hello@cvtrades.co.uk" className="text-blue-600 hover:underline font-medium">hello@cvtrades.co.uk</a>
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
