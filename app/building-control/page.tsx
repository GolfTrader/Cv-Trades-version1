import Link from "next/link";

export default function BuildingControlPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">

      <div className="text-center mb-12">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
          Help with your project
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Building Control Explained</h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto">
          Building regulations ensure construction work is safe, accessible, and energy efficient.
          Here's what you need to know before starting your project.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">What is building control?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Building control ensures building work meets the standards set out in the Building Regulations,
          covering structural integrity, fire safety, energy efficiency, and accessibility.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Building control is separate from planning permission. You may need one, both, or neither
          depending on your project. Always check before work begins — carrying out work without
          required approvals can cause serious problems when you sell your home.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">How the process works</h2>
        <div className="space-y-4">
          {[
            { n: "01", title: "Check if you need approval", body: "Not all building work requires approval. Minor repairs and like-for-like replacements often don't, but extensions, conversions, and structural work usually do." },
            { n: "02", title: "Choose your route", body: "Apply through your local authority building control (LABC) or use an approved inspector. Both routes result in the same approval." },
            { n: "03", title: "Submit your application", body: "Submit a Full Plans application (recommended for larger projects) or a Building Notice (suitable for smaller works)." },
            { n: "04", title: "Inspections take place", body: "Your builder must notify building control at key stages. An inspector will visit to check foundations, damp proof course, drains, and completion." },
            { n: "05", title: "Receive your completion certificate", body: "When all work is signed off you'll receive a completion certificate. Keep this safe — you'll need it when you sell your property." },
          ].map((step) => (
            <div key={step.n} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex gap-5">
              <div className="text-2xl font-black text-blue-100 shrink-0 w-8">{step.n}</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Projects that commonly need approval</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {["House extensions","Loft conversions","Garage conversions","Structural alterations","New heating system","Electrical work","Underpinning","Cavity wall insulation","New windows and doors","New bathrooms (in some cases)"].map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-blue-600 font-bold">✓</span>{p}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Local authority contacts</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          For projects in the Coventry and Warwickshire area, contact your local council or use a government-approved private building inspector.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "Coventry City Council", url: "https://www.coventry.gov.uk" },
            { name: "Warwick District Council", url: "https://www.warwickdc.gov.uk" },
            { name: "Rugby Borough Council", url: "https://www.rugby.gov.uk" },
            { name: "Stratford District Council", url: "https://www.stratford.gov.uk" },
          ].map((c) => (
            <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{c.name}</span>
              <span className="text-blue-600 text-xs">↗</span>
            </a>
          ))}
        </div>
      </section>

      <div className="text-center bg-blue-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-2">Need a tradesperson for your project?</h2>
        <p className="text-blue-100 text-sm mb-5">Find trusted, local tradespeople across the CV postcode area.</p>
        <Link href="/" className="inline-block px-6 py-2.5 bg-white text-blue-600 font-semibold text-sm rounded-xl hover:bg-blue-50 transition">
          Find a Tradesperson
        </Link>
      </div>

    </div>
  );
}