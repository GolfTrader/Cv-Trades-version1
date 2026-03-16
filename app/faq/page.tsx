import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | CV Trades Directory",
  description: "Frequently asked questions about CV Trades Directory — finding tradespeople, listing your business, and more.",
};

const faqs = [
  {
    category: "Finding a Tradesperson",
    items: [
      {
        q: "How do I find a tradesperson in my area?",
        a: "Simply use the search bar on the homepage. Select your area from the dropdown, choose the trade you need, and click Search. You'll see a list of verified local professionals instantly.",
      },
      {
        q: "Are all tradespeople on CV Trades verified?",
        a: "Every tradesperson listed on CV Trades Directory has been reviewed before their listing goes live. We check that they are based in the CV postcode area and that their details are accurate.",
      },
      {
        q: "What areas does CV Trades cover?",
        a: "We cover the entire CV postcode area including Coventry, Kenilworth, Leamington Spa, Warwick, Stratford, Bedworth, Nuneaton, Atherstone, Southam and more.",
      },
      {
        q: "Can I contact a tradesperson directly?",
        a: "Yes — every profile page shows the tradesperson's phone number, mobile, email and any social/website links. You can call or email them directly from their profile.",
      },
      {
        q: "What does a Featured Professional listing mean?",
        a: "Featured Professionals are tradespeople who have upgraded their listing and appear at the top of search results with an enhanced profile card.",
      },
    ],
  },
  {
    category: "For Tradespeople",
    items: [
      {
        q: "How do I get listed on CV Trades?",
        a: "Click the 'Tradesperson Signup' button in the top navigation or visit the advertise page. Fill in your business details and we'll review and publish your listing.",
      },
      {
        q: "How much does it cost to list my business?",
        a: "Basic listings are free. We also offer Featured Professional packages for enhanced visibility. Contact us for current pricing.",
      },
      {
        q: "How do I update my listing details?",
        a: "Contact us with your business name and the changes you'd like to make. We'll update your profile promptly.",
      },
      {
        q: "Can customers leave reviews on my profile?",
        a: "Yes. Customers can leave a star rating and written review directly on your profile page. Reviews help build trust with potential customers.",
      },
    ],
  },
  {
    category: "Reviews & Ratings",
    items: [
      {
        q: "How do I leave a review for a tradesperson?",
        a: "Navigate to the tradesperson's profile page and scroll down to the Customer Reviews section. You can leave a star rating and written comment.",
      },
      {
        q: "Can reviews be removed?",
        a: "We reserve the right to remove reviews that violate our terms of service, including fake, abusive or irrelevant reviews.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container-page text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Support</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto text-sm">
            Everything you need to know about CV Trades Directory. Can't find what you're looking for?{" "}
            <a href="mailto:hello@cvtrades.co.uk" className="text-primary hover:underline">Get in touch</a>.
          </p>
        </div>
      </section>

      {/* FAQ content */}
      <div className="container-page py-12 max-w-3xl">

        {faqs.map((section) => (
          <div key={section.category} className="mb-10">
            <h2 className="mb-5 text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <details key={i} className="group rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-slate-800 hover:text-primary transition-colors list-none">
                    <span>{item.q}</span>
                    <span className="ml-4 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform text-lg">▾</span>
                  </summary>
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
          <h3 className="text-base font-bold text-slate-900 mb-2">Still have questions?</h3>
          <p className="text-sm text-slate-600 mb-4">We're happy to help. Reach out and we'll get back to you quickly.</p>
          <Link href="/contact" className="btn-primary text-sm">
            Contact Us
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-primary hover:underline">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
