import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | CV Trades Directory",
  description: "Learn about CV Trades Directory — the modern, trusted directory connecting homeowners with skilled local tradespeople across the CV postcode area.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 text-white">
        <div className="container-page text-center max-w-3xl mx-auto">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Our Story</p>
          <h1 className="text-3xl font-bold sm:text-5xl leading-tight">
            Built for the <span className="text-primary">CV Postcode</span>
          </h1>
          <p className="mt-5 text-slate-300 text-sm leading-relaxed sm:text-base max-w-xl mx-auto">
            CV Trades Directory was created to solve a simple problem — finding a reliable, local tradesperson shouldn't be difficult. We built the directory we wish existed.
          </p>
        </div>
      </section>

      <div className="container-page py-14 max-w-4xl space-y-14">

        {/* Mission */}
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Our Mission</p>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Connecting local people with local trades</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              We believe that the best tradespeople are the ones right on your doorstep — people who live in your community, care about their reputation, and take pride in their work.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              CV Trades Directory exists to make those connections easier. Whether you need a plumber in Coventry, an electrician in Kenilworth, or a builder in Leamington Spa — we've got you covered.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🏠", label: "Local Focus", desc: "CV postcode only — no national agencies" },
              { icon: "✅", label: "Vetted Listings", desc: "Every listing reviewed before going live" },
              { icon: "⭐", label: "Real Reviews", desc: "Genuine feedback from real customers" },
              { icon: "🔍", label: "Easy Search", desc: "Find trades by area and category" },
            ].map(item => (
              <div key={item.label} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 text-center">
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-sm font-bold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">What We Stand For</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Our Values</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: "🤝", title: "Trust", desc: "We only list tradespeople we believe are genuine, local businesses. Every listing is reviewed before it goes live." },
              { icon: "📍", title: "Local First", desc: "We are 100% focused on the CV postcode area. No national chains, no call centres — just real local professionals." },
              { icon: "💬", title: "Transparency", desc: "Honest reviews, clear profiles, and no hidden fees. What you see is what you get." },
            ].map(v => (
              <div key={v.title} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
                <p className="text-3xl mb-3">{v.icon}</p>
                <h3 className="text-base font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage */}
        <div className="rounded-2xl bg-slate-900 p-8 text-white">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Coverage</p>
              <h2 className="text-2xl font-bold mb-3">Serving the entire CV Postcode</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                From Coventry city centre to the villages of Warwickshire — we're building the most comprehensive network of trusted tradespeople across the region.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Coventry", "Kenilworth", "Leamington Spa", "Warwick", "Stratford", "Bedworth", "Nuneaton", "Atherstone", "Southam"].map(area => (
                <span key={area} className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-medium text-white/80">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 text-center">
            <p className="text-2xl mb-3">🔍</p>
            <h3 className="text-base font-bold text-slate-900 mb-2">Find a Tradesperson</h3>
            <p className="text-sm text-slate-500 mb-4">Search our directory for trusted local professionals.</p>
            <Link href="/" className="btn-primary text-sm">Search Now</Link>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 text-center">
            <p className="text-2xl mb-3">🏗️</p>
            <h3 className="text-base font-bold text-slate-900 mb-2">List Your Business</h3>
            <p className="text-sm text-slate-500 mb-4">Join the directory and get found by local customers.</p>
            <Link href="/advertise" className="btn-primary text-sm">Get Listed</Link>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Have a question?{" "}
            <Link href="/contact" className="text-primary hover:underline font-medium">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
