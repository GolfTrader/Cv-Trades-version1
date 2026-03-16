import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | CV Trades Directory",
  description: "Get in touch with CV Trades Directory. We're here to help with any questions about finding tradespeople or listing your business.",
};

export default function ContactPage() {
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
        <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">

          {/* Contact details */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-base">✉️</div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</p>
                    <a href="mailto:hello@cvtrades.co.uk" className="text-sm font-medium text-primary hover:underline">hello@cvtrades.co.uk</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-base">📍</div>
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
                <li>
                  <Link href="/faq" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                    <span>📋</span> View our FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/advertise" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                    <span>🏗️</span> Tradesperson Signup
                  </Link>
                </li>
                <li>
                  <Link href="/building-control" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                    <span>🏗️</span> Building Control Guide
                  </Link>
                </li>
                <li>
                  <Link href="/planning-application" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                    <span>📋</span> Planning Application Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">Send Us a Message</h2>
            <form
              action="mailto:hello@cvtrades.co.uk"
              method="post"
              encType="text/plain"
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Smith"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subject
                </label>
                <select
                  name="subject"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
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
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-sm"
              >
                Send Message
              </button>

              <p className="text-center text-xs text-slate-400">
                Or email us directly at{" "}
                <a href="mailto:hello@cvtrades.co.uk" className="text-primary hover:underline">
                  hello@cvtrades.co.uk
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
