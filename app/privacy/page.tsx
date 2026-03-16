import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | CV Trades Directory",
  description: "Privacy Policy for CV Trades Directory.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-slate-300">Privacy Policy</span>
          </nav>
          <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-slate-300 text-sm">Last updated: March 2026</p>
        </div>
      </section>

      <div className="container-page py-12 max-w-3xl space-y-8">
        {[
          {
            title: "1. Who We Are",
            content: "CV Trades Directory operates the website cvtrades.co.uk. We are committed to protecting your personal data and complying with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018."
          },
          {
            title: "2. What Data We Collect",
            content: "We may collect the following information: name and contact details when you register or contact us, business information submitted by tradespeople for their listings, reviews and ratings you submit, usage data and analytics about how you use our website, and technical data such as IP address, browser type and device information."
          },
          {
            title: "3. How We Use Your Data",
            content: "We use your data to: provide and improve our directory service, display tradesperson listings and reviews, respond to enquiries and support requests, send service-related communications, and analyse website usage to improve user experience."
          },
          {
            title: "4. Legal Basis for Processing",
            content: "We process your data on the following legal bases: performance of a contract (to provide the Service), legitimate interests (to improve and operate the Service), consent (for marketing communications), and legal obligation (to comply with applicable laws)."
          },
          {
            title: "5. Data Sharing",
            content: "We do not sell your personal data to third parties. We may share data with trusted service providers who assist in operating our website (such as hosting and analytics providers), subject to confidentiality agreements. We may also disclose data where required by law."
          },
          {
            title: "6. Data Retention",
            content: "We retain personal data only for as long as necessary to provide the Service and comply with our legal obligations. Tradesperson listing data is retained while the listing is active. You may request deletion of your data at any time."
          },
          {
            title: "7. Your Rights",
            content: "Under UK GDPR, you have the right to: access your personal data, correct inaccurate data, request deletion of your data, object to or restrict processing, and data portability. To exercise any of these rights, contact us at hello@cvtrades.co.uk."
          },
          {
            title: "8. Cookies",
            content: "We use cookies to improve your experience on our website. Please see our Cookie Policy for full details."
          },
          {
            title: "9. Contact",
            content: "For any privacy-related queries, contact us at hello@cvtrades.co.uk. If you are not satisfied with our response, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk."
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
