import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Building Control | CV Trades Directory",
  description: "Everything you need to know about building control in the CV postcode area. When you need it, how to apply, and finding approved tradespeople.",
};

export default function BuildingControlPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-slate-300">Building Control</span>
          </nav>
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Help with your project</p>
            <h1 className="text-3xl font-bold sm:text-4xl">🏗️ Building Control</h1>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Understanding building control is essential for any structural home improvement. 
              Here's what you need to know before starting your project in the CV area.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-12 max-w-3xl space-y-8">

        {/* What is it */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">What is Building Control?</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Building control is the process by which your local authority checks that building work meets the minimum standards set out in the Building Regulations. These regulations cover structural integrity, fire safety, energy efficiency, accessibility and more.
          </p>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Building control approval is separate from planning permission — you may need one, the other, or both depending on your project.
          </p>
        </div>

        {/* When do you need it */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">When Do You Need Building Control?</h2>
          <div className="space-y-3">
            {[
              { icon: "🏠", title: "Extensions", desc: "Any extension to your home, including single or double storey." },
              { icon: "🔧", title: "Structural alterations", desc: "Removing or altering load-bearing walls, beams or chimney stacks." },
              { icon: "🚿", title: "New bathrooms or kitchens", desc: "Installing new drainage or moving existing plumbing." },
              { icon: "⚡", title: "Electrical work", desc: "Major electrical installations or consumer unit replacements." },
              { icon: "🔥", title: "Boilers & heating", desc: "Installing a new boiler, heating system or gas appliances." },
              { icon: "🏗️", title: "Loft conversions", desc: "Converting your loft into a habitable room." },
              { icon: "🪟", title: "New windows & doors", desc: "Replacement windows and doors must meet energy efficiency standards." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to apply */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">How to Apply</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Full Plans Application", desc: "Submit detailed plans before work starts. An inspector approves the plans, then inspects the work at key stages. Best for larger projects." },
              { step: "2", title: "Building Notice", desc: "Notify your local authority before work begins without submitting full plans. Suitable for smaller, straightforward projects." },
              { step: "3", title: "Regularisation", desc: "If work has already been done without approval, you can apply retrospectively to regularise it." },
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

        {/* Local authority */}
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-2">Local Authority Contacts</h2>
          <p className="text-sm text-slate-600 mb-4">For projects in the CV postcode area, contact your relevant local authority:</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-100">
              <span className="font-medium text-slate-800">Coventry City Council</span>
              <a href="https://www.coventry.gov.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">coventry.gov.uk</a>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-100">
              <span className="font-medium text-slate-800">Warwick District Council</span>
              <a href="https://www.warwickdc.gov.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">warwickdc.gov.uk</a>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-100">
              <span className="font-medium text-slate-800">Nuneaton & Bedworth Borough Council</span>
              <a href="https://www.nuneatonandbedworth.gov.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">nuneatonandbedworth.gov.uk</a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-slate-900 p-8 text-center text-white">
          <h3 className="text-base font-bold mb-2">Need a tradesperson for your project?</h3>
          <p className="text-sm text-slate-300 mb-5">Find trusted local professionals across the CV postcode area.</p>
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
