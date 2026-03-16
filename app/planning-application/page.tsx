import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Planning Application | CV Trades Directory",
  description: "A guide to planning applications in the CV postcode area. When you need planning permission, how to apply, and what to expect.",
};

export default function PlanningApplicationPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-slate-300">Planning Application</span>
          </nav>
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Help with your project</p>
            <h1 className="text-3xl font-bold sm:text-4xl">📋 Planning Applications</h1>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Not sure if your project needs planning permission? This guide covers everything you need to know for projects in the CV postcode area.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-12 max-w-3xl space-y-8">

        {/* What is planning permission */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">What is Planning Permission?</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Planning permission is formal approval from your local council to carry out certain types of building work or change the use of a building. It ensures development is appropriate for the local area in terms of design, impact on neighbours and the environment.
          </p>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Many smaller home improvements are covered by <strong>Permitted Development Rights</strong> — meaning you don't need to apply for planning permission. However, if you live in a conservation area, listed building or have had your permitted development rights removed, you will need to apply.
          </p>
        </div>

        {/* Do you need it */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Do You Need Planning Permission?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: "✅", title: "Usually NOT needed", items: ["Small rear extensions (within limits)", "Loft conversions (no hip-to-gable)", "Internal alterations", "Replacing windows like-for-like", "Garden sheds & outbuildings (under 2.5m)"] },
              { icon: "⚠️", title: "Usually NEEDED", items: ["Large extensions beyond PD limits", "New dwellings or subdivisions", "Change of use (e.g. office to residential)", "Work on listed buildings", "Projects in conservation areas"] },
            ].map((col) => (
              <div key={col.title} className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800 mb-3">{col.icon} {col.title}</p>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-0.5 text-slate-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How to apply */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">How to Apply</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Check if you need permission", desc: "Use the Planning Portal's interactive house tool or contact your local council to check if your project requires permission." },
              { step: "2", title: "Prepare your application", desc: "You'll typically need site plans, floor plans, elevations and a design and access statement for larger projects." },
              { step: "3", title: "Submit online", desc: "Submit your application via the Planning Portal (planningportal.co.uk) or directly to your local council." },
              { step: "4", title: "Wait for a decision", desc: "Most householder applications are decided within 8 weeks. You'll be notified in writing of the decision." },
              { step: "5", title: "Start work", desc: "Once approved, you typically have 3 years to start work. Keep your approval notice safe — you'll need it when selling." },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Useful links */}
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Useful Links</h2>
          <div className="space-y-2 text-sm">
            {[
              { label: "Planning Portal", href: "https://www.planningportal.co.uk", desc: "Submit applications & check permitted development" },
              { label: "Coventry City Council Planning", href: "https://www.coventry.gov.uk/planning", desc: "Local planning applications for Coventry" },
              { label: "Warwick District Council Planning", href: "https://www.warwickdc.gov.uk/planning", desc: "Local planning for Warwick & Leamington Spa" },
              { label: "Historic England", href: "https://historicengland.org.uk", desc: "Guidance for listed buildings & conservation areas" },
            ].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                <div>
                  <p className="font-medium text-slate-800 group-hover:text-primary transition-colors">{link.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{link.desc}</p>
                </div>
                <span className="text-slate-400 group-hover:text-primary transition-colors">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-slate-900 p-8 text-center text-white">
          <h3 className="text-base font-bold mb-2">Ready to find a tradesperson?</h3>
          <p className="text-sm text-slate-300 mb-5">Search for trusted local professionals across the CV postcode area.</p>
          <Link href="/" className="btn-primary text-sm">
            Search Tradespeople
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-primary hover:underline">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
