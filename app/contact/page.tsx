'use client';

import { useState } from "react";
import Link from "next/link";

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

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-slate-300">Contact Us</span>
          </nav>
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Get in Touch</p>
            <h1 className="text-3xl font-bold sm:text-4xl">Contact Us</h1>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Have a question, need help, or want to list your business? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-12 max-w-4xl">
        {submitted ? (
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-10 text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Message sent!</h2>
            <p className="text-sm text-slate-500 mb-6">
              Thanks for getting in touch. We'll get back to you at <strong>{form.email}</strong> as soon as possible.
            </p>
            <Link href="/" className="btn-primary text-sm">Back to Home</Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">

            {/* Contact details */}
            <div className="space-y-5">
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">✉️</div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</p>
                      <a href="mailto:hello@cvtrades.co.uk" className="text-sm font-medium text-primary hover:underline">
                        hello@cvtrades.co.uk
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">📍</div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Coverage Area</p>
                      <p className="text-sm text-slate-600">CV Postcode Area<br />Coventry & Warwickshire</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-3">Quick Links</h2>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/faq" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"><span>📋</span> View our FAQ</Link></li>
                  <li><Link href="/advertise" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"><span>🏗️</span> Tradesperson Signup</Link></li>
                  <li><Link href="/building-control" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"><span>🏗️</span> Building Control Guide</Link></li>
                  <li><Link href="/planning-application" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"><span>📋</span> Planning Application Guide</Link></li>
                </ul>
              </div>
            </div>

            {/* Contact form */}
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 mb-5">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" value={form.name} onChange={e => update("name", e.target.value)}
                      placeholder="John Smith"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</label>
                  <select value={form.subject} onChange={e => update("subject", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
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
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea value={form.message} onChange={e => update("message", e.target.value)}
                    rows={5} placeholder="How can we help you?"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button type="submit" disabled={submitting}
                  className="btn-primary w-full py-3 text-sm disabled:opacity-50">
                  {submitting ? "Sending..." : "Send Message"}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Or email us directly at{" "}
                  <a href="mailto:hello@cvtrades.co.uk" className="text-primary hover:underline">hello@cvtrades.co.uk</a>
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
