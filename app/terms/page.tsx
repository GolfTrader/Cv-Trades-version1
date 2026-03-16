import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | CV Trades Directory",
  description: "Terms of Service for CV Trades Directory.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-slate-300">Terms of Service</span>
          </nav>
          <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
          <p className="mt-3 text-slate-300 text-sm">Last updated: March 2026</p>
        </div>
      </section>

      <div className="container-page py-12 max-w-3xl space-y-8">
        {[
          {
            title: "1. Acceptance of Terms",
            content: "By accessing and using CV Trades Directory ('the Service'), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service."
          },
          {
            title: "2. Description of Service",
            content: "CV Trades Directory is an online directory connecting homeowners and businesses with local tradespeople in the CV postcode area of England. We provide a platform for tradespeople to advertise their services and for customers to find and contact them."
          },
          {
            title: "3. User Responsibilities",
            content: "Users of this Service agree to: provide accurate and truthful information, not misuse or attempt to damage the Service, not post false, misleading or defamatory reviews, and comply with all applicable laws and regulations."
          },
          {
            title: "4. Tradesperson Listings",
            content: "Tradespeople listed on CV Trades Directory are independent businesses and are not employees or agents of CV Trades Directory. We do not guarantee the quality, safety or legality of their services. Users engage tradespeople at their own risk and should carry out their own due diligence."
          },
          {
            title: "5. Reviews and Ratings",
            content: "Reviews submitted must be genuine, based on real experience, and comply with our community guidelines. We reserve the right to remove any review that we believe to be false, defamatory, abusive or in violation of these terms."
          },
          {
            title: "6. Intellectual Property",
            content: "All content on CV Trades Directory, including text, graphics, logos and software, is the property of CV Trades Directory and is protected by applicable intellectual property laws. You may not reproduce or distribute any content without our prior written consent."
          },
          {
            title: "7. Limitation of Liability",
            content: "CV Trades Directory shall not be liable for any indirect, incidental, special or consequential damages arising from your use of the Service or from any services provided by tradespeople listed on the directory."
          },
          {
            title: "8. Changes to Terms",
            content: "We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Your continued use of the Service after any changes constitutes your acceptance of the new terms."
          },
          {
            title: "9. Contact",
            content: "If you have any questions about these Terms of Service, please contact us at hello@cvtrades.co.uk."
          },
        ].map((section) => (
          <div key={section.title} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">{section.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
          </div>
        ))}

        <div className="text-center pt-4">
          <Link href="/" className="text-sm text-primary hover:underline">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
