"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  {
    id: "general",
    label: "General",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-14v4m0 4h.01"/>
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
        a: "Yes — searching the directory and contacting tradespeople is completely free for homeowners. Tradespeople can also list their business for free on a standard listing.",
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
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
    description: "Finding & hiring tradespeople",
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
        a: "Visit the tradesperson's profile page and scroll to the reviews section. Click 'Leave a Review', fill in your details and rating, then submit. All reviews are moderated before going live to ensure they're genuine.",
      },
      {
        q: "What if I have a problem with a tradesperson?",
        a: "We take quality seriously. If you've had a poor experience with a listed tradesperson, please contact us with details and we'll investigate. We reserve the right to remove listings that receive consistent negative feedback.",
      },
      {
        q: "Do tradespeople pay to be featured?",
        a: "Some tradespeople opt for a Featured listing which gives them higher visibility. This is clearly marked on their profile. All listed tradespeople — featured or standard — are reviewed by our team before going live.",
      },
    ],
  },
  {
    id: "tradespeople",
    label: "Tradespeople",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"/>
      </svg>
    ),
    description: "Listing your business",
    faqs: [
      {
        q: "How do I list my business?",
        a: "Click 'Tradesperson Signup' in the navigation and complete the simple 4-step form. You'll provide your business details, contact information, trade category, and choose your listing tier. Your listing will be reviewed and published within 1–2 business days.",
      },
      {
        q: "How much does a listing cost?",
        a: "A standard listing is completely free and includes your business name, description, contact details, and customer reviews. There's no catch — we want to support local tradespeople across the CV area.",
      },
      {
        q: "What is a Featured listing?",
        a: "Featured listings cost £29/month and appear at the top of search results with a highlighted badge. This significantly increases your visibility and the number of enquiries you receive compared to a standard listing.",
      },
      {
        q: "How long does approval take?",
        a: "We aim to review and approve all new listings within 1–2 business days. You'll be able to view your listing live on the directory once it's been approved by our team.",
      },
      {
        q: "Can I edit my listing after it goes live?",
        a: "Please contact us via the contact page with any changes and we'll update your listing promptly. A self-service tradesperson dashboard where you can manage your own listing is on our roadmap.",
      },
      {
        q: "Can I cancel my Featured listing?",
        a: "Yes, you can cancel your Featured listing at any time. Please contact us and we'll process the cancellation. Your listing will revert to a standard free listing rather than being removed entirely.",
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 flex items-start justify-between gap-4 group"
      >
        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition leading-snug">
          {q}
        </span>
        <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-200 ${open ? "bg-blue-600 border-blue-600 rotate-45" : "bg-white"}`}>
          <svg className={`w-3 h-3 transition-colors ${open ? "text-white" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 pb-5" : "max-h-0"}`}>
        <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const current = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4">
            Support
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            How can we help?
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Find answers to common questions about CV Trades Directory — whether you're looking for a tradesperson or want to list your business.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* SIDEBAR TABS */}
          <div className="md:w-56 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-1">
              Categories
            </p>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 group ${
                    activeCategory === cat.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span className={activeCategory === cat.id ? "text-white" : "text-gray-400 group-hover:text-gray-600"}>
                    {cat.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{cat.label}</p>
                    <p className={`text-xs leading-tight mt-0.5 ${activeCategory === cat.id ? "text-blue-200" : "text-gray-400"}`}>
                      {cat.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ CONTENT */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              {/* CATEGORY HEADER */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  {current.icon}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{current.label}</h2>
                  <p className="text-xs text-gray-500">{current.faqs.length} questions</p>
                </div>
              </div>

              {/* ACCORDIONS */}
              <div className="px-6">
                {current.faqs.map((faq) => (
                  <AccordionItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>

            {/* STILL NEED HELP */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Still have questions?</h3>
                <p className="text-xs text-gray-500 mt-0.5">Our team usually responds within one business day.</p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Contact Us →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}