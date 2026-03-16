import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | CV Trades Directory",
  description: "Cookie Policy for CV Trades Directory.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-slate-300">Cookie Policy</span>
          </nav>
          <h1 className="text-3xl font-bold sm:text-4xl">Cookie Policy</h1>
          <p className="mt-3 text-slate-300 text-sm">Last updated: March 2026</p>
        </div>
      </section>

      <div className="container-page py-12 max-w-3xl space-y-8">
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-3">What Are Cookies?</h2>
          <p className="text-sm text-slate-600 leading-relaxed">Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, understand how you use the site, and improve your experience.</p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Cookies We Use</h2>
          <div className="space-y-4">
            {[
              { type: "Essential Cookies", badge: "Always Active", badgeColor: "bg-green-100 text-green-700", desc: "These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as setting your privacy preferences or filling in forms." },
              { type: "Analytics Cookies", badge: "Optional", badgeColor: "bg-blue-100 text-blue-700", desc: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. All information these cookies collect is aggregated and anonymous." },
              { type: "Functional Cookies", badge: "Optional", badgeColor: "bg-purple-100 text-purple-700", desc: "These cookies enable the website to provide enhanced functionality and personalisation, such as remembering your search preferences." },
            ].map((item) => (
              <div key={item.type} className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-slate-800">{item.type}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.badgeColor}`}>{item.badge}</span>
                </div>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-3">Managing Cookies</h2>
          <p className="text-sm text-slate-600 leading-relaxed">You can control and manage cookies in your browser settings. Please note that removing or blocking cookies may impact your experience on our website. Most browsers allow you to refuse cookies or delete them — check your browser's help documentation for instructions.</p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-3">Contact</h2>
          <p className="text-sm text-slate-600 leading-relaxed">If you have any questions about our use of cookies, please contact us at <a href="mailto:hello@cvtrades.co.uk" className="text-primary hover:underline">hello@cvtrades.co.uk</a> or visit our <Link href="/contact" className="text-primary hover:underline">Contact page</Link>.</p>
        </div>

        <div className="text-center pt-4">
          <Link href="/" className="text-sm text-primary hover:underline">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
