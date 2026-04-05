"use client";

import { useState } from "react";

const categories = [
  {
    id: "general",
    label: "General",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 9v4M10 7v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    description: "About CV Trades Directory",
    faqs: [
      {
        q: "What is CV Trades Directory?",
        a: "CV Trades Directory is a local directory connecting homeowners and businesses across the Coventry and Warwickshire (CV postcode) area with trusted, verified tradespeople. We make it simple to find the right tradesperson for any job.",
      },
      {
        q: "What areas do you cover?",
        a: "We cover all CV postcode areas including Coventry, Warwick, Leamington Spa, Kenilworth, Nuneaton, Rugby, Stratford-upon-Avon, and all surrounding areas within the CV postcode region.",
      },
      {
        q: "Is CV Trades Directory free to use?",
        a: "Yes, searching the directory and contacting tradespeople is completely free for homeowners. Tradespeople can also list their business for free on a standard listing.",
      },
      {
        q: "How do I contact CV Trades?",
        a: "You can reach us via our contact page. We aim to respond to all enquiries within one business day.",
      },
    ],
  },
  {
    id: "homeowners",
    label: "Homeowners",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 11l2-2m0 0l5-5 5 5M5 9v7a1 1 0 001 1h3m6-8l2 2m-2-2v7a1 1 0 01-1 1h-3m-2 0a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1m-6 0h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    description: "Finding and hiring tradespeople",
    faqs: [
      {
        q: "How do I find a tradesperson?",
        a: "Use the search on our homepage to filter by trade type and area. Browse profiles, read reviews, and contact the tradesperson directly via their listed phone number or website.",
      },
      {
        q: "Are the tradespeople verified?",
        a: "Every listing is manually reviewed by our team before going live. We check each business is legitimate and based in the CV postcode area. We also display customer reviews to help you make an informed decision.",
      },
      {
        q: "How do I leave a review?",
        a: "Visit the tradesperson profile page and scroll to the reviews section. Click Leave a Review, fill in your details and rating, then submit. All reviews are moderated before going live to ensure they are genuine.",
      },
      {
        q: "What if I have a problem with a tradesperson?",
        a: "We take quality seriously. If you have had a poor experience with a listed tradesperson, please contact us with details and we will investigate. We reserve the right to remove listings that receive consistent negative feedback.",
      },
      {
        q: "Do tradespeople pay to be featured?",
        a: "Some tradespeople opt for a Featured listing which gives them higher visibility. This is clearly marked on their profile. All listed tradespeople, featured or standard, are reviewed by our team before going live.",
      },
    ],
  },
  {
    id: "tradespeople",
    label: "Tradespeople",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M14.5 3.5l2 2-9 9H5.5v-2l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 6l2 2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    description: "Listing your business",
    faqs: [
      {
        q: "How do I list my business?",
        a: "Click Tradesperson Signup in the navigation and complete the simple form. You will provide your business details, contact information, trade category, and choose your listing tier. Your listing will be reviewed and published within 1 to 2 business days.",
      },
      {
        q: "How much does a listing cost?",
        a: "A standard listing is completely free and includes your business name, description, contact details, and customer reviews. There is no catch, we want to support local tradespeople across the CV area.",
      },
      {
        q: "What is a Featured listing?",
        a: "Featured listings appear at the top of search results with a highlighted badge and homepage carousel placement. This significantly increases your visibility and the number of enquiries you receive compared to a standard listing.",
      },
      {
        q: "How long does approval take?",
        a: "We aim to review and approve all new listings within 1 to 2 business days. You will be able to view your listing live on the directory once it has been approved by our team.",
      },
      {
        q: "Can I edit my listing after it goes live?",
        a: "Please contact us via the contact page with any changes and we will update your listing promptly. A self-service tradesperson dashboard where you can manage your own listing is on our roadmap.",
      },
      {
        q: "Can I cancel my Featured listing?",
        a: "Yes, you can cancel your Featured listing at any time. Please contact us and we will process the cancellation. Your listing will revert to a standard free listing rather than being removed entirely.",
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 sm:py-6 flex items-start justify-between gap-4 group"
      >
        <span className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition leading-snug">
          {q}
        </span>
        <span className={`shrink-0 mt-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${open ? "bg-blue-600 border-blue-600 rotate-45" : "bg-white border-slate-200"}`}>
          <svg className={`w-3.5 h-3.5 transition-colors ${open ? "text-white" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 pb-6" : "max-h-0"}`}>
        <p className="text-base text-slate-500 leading-relaxed pr-12">{a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const current = categories.find((c) => c.id === activeCategory)!;

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
            <span className="text-slate-300">FAQ</span>
          </nav>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/20 px-4 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-semibold text-blue-300 uppercase tracking-wide">Support</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              How can we<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                help you?
              </span>
            </h1>

            <p className="mt-5 text-slate-300 text-lg leading-relaxed max-w-xl">
              Find answers to common questions about CV Trades Directory, whether you are looking for a tradesperson or want to list your business.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          {/* Sidebar tabs */}
          <div className="md:w-64 shrink-0">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-1">
              Categories
            </p>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl transition-all flex items-center gap-3.5 group ${
                    activeCategory === cat.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200/50"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className={`flex-shrink-0 ${activeCategory === cat.id ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}>
                    {cat.icon}
                  </span>
                  <div>
                    <p className="text-sm font-bold leading-tight">{cat.label}</p>
                    <p className={`text-xs leading-tight mt-0.5 ${activeCategory === cat.id ? "text-blue-200" : "text-slate-400"}`}>
                      {cat.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick contact card */}
            <div className="mt-6 rounded-xl bg-slate-900 p-5 hidden md:block">
              <h3 className="text-sm font-bold text-white mb-1">Need more help?</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">Our team usually responds within one business day.</p>
              <a
                href="/contact"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all"
              >
                Contact Us
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* FAQ content */}
          <div className="flex-1">
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">

              {/* Category header */}
              <div className="px-7 sm:px-8 py-6 border-b border-slate-100 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  {current.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{current.label}</h2>
                  <p className="text-sm text-slate-400">{current.faqs.length} questions</p>
                </div>
              </div>

              {/* Accordions */}
              <div className="px-7 sm:px-8">
                {current.faqs.map((faq) => (
                  <AccordionItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>

            {/* Still need help - mobile */}
            <div className="mt-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 md:hidden">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Still have questions?</h3>
                <p className="text-sm text-slate-400 mt-1">Our team usually responds within one business day.</p>
              </div>
              <a
                href="/contact"
                className="shrink-0 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
