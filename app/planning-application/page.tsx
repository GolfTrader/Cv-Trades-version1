import Link from "next/link";

export default function PlanningApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4">Help with your project</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Planning Permission Explained</h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">Thinking about an extension, conversion, or new build? Here is everything you need to know about planning permission in the Coventry and Warwickshire area.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What is planning permission?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">Planning permission is formal approval from your local council to carry out certain types of building work or change the use of a building or land. It ensures development is appropriate for the local area and complies with national and local planning policy.</p>
          <p className="text-gray-600 leading-relaxed">Planning permission is separate from building regulations. You may need one, both, or neither. Always check before starting work as carrying out work without required permission can cause serious problems when selling your home.</p>
        </section>
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Do you need planning permission?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-green-50 border border-green-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><span className="text-green-600">✓</span> Usually permitted development</h3>
              <ul className="space-y-2">
                {["Small single-storey rear extensions","Internal alterations","Like-for-like roof repairs","Most garden sheds and outbuildings","Driveways with permeable surfacing","Solar panels (in most cases)"].map((item) => (
                  <li key={item} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-green-500 shrink-0">✓</span>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><span className="text-amber-600">!</span> Usually needs permission</h3>
              <ul className="space-y-2">
                {["Large or multi-storey extensions","Loft conversions with roof alterations","New dwellings or subdivisions","Change of use of a building","Work on a listed building","Work in a conservation area"].map((item) => (
                  <li key={item} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-amber-500 shrink-0">!</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Not sure? Always check with your local planning authority before starting work.</p>
        </section>
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">How to apply</h2>
          <div className="space-y-4">
            {[
              {n:"01",title:"Check if you need it",body:"Use the Planning Portal guides or contact your local planning authority for pre-application advice. Many smaller projects fall under permitted development."},
              {n:"02",title:"Prepare your application",body:"You will need a completed application form, site location plan, block plan, existing and proposed floor plans and elevations, and the application fee."},
              {n:"03",title:"Submit via the Planning Portal",body:"Most applications are submitted online via planningportal.co.uk which connects directly to your local council's planning department."},
              {n:"04",title:"Consultation period",body:"Once validated, your application is publicised for public comment for 21 days. Neighbours and statutory consultees may submit responses."},
              {n:"05",title:"Decision",body:"Most householder applications are decided within 8 weeks. You will receive a decision notice — approval with conditions or refusal with reasons."},
              {n:"06",title:"Build within the permission",body:"Planning permission is usually valid for 3 years. Build in accordance with the approved plans and keep your decision notice safe."},
            ].map((step) => (
              <div key={step.n} className="flex gap-5 p-5 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition">
                <div className="text-2xl font-black text-blue-100 shrink-0 w-8">{step.n}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Local planning authorities</h2>
          <p className="text-sm text-gray-500 mb-6">Submit your application through the relevant council for your area.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {name:"Coventry City Council",area:"Coventry",url:"https://www.coventry.gov.uk/planning"},
              {name:"Warwick District Council",area:"Warwick, Leamington, Kenilworth",url:"https://www.warwickdc.gov.uk/planning"},
              {name:"Rugby Borough Council",area:"Rugby and surrounding",url:"https://www.rugby.gov.uk/planning"},
              {name:"Stratford District Council",area:"Stratford-upon-Avon area",url:"https://www.stratford.gov.uk/planning"},
              {name:"Nuneaton & Bedworth Borough",area:"Nuneaton, Bedworth",url:"https://www.nuneatonandbedworth.gov.uk"},
              {name:"Planning Portal",area:"National online submission",url:"https://www.planningportal.co.uk"},
            ].map((c) => (
              <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition group">
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">{c.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.area}</p>
                </div>
                <span className="text-blue-500 text-sm">↗</span>
              </a>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tips for a successful application</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {title:"Talk to your neighbours",body:"Letting neighbours know about your plans before submitting can prevent objections that delay or derail your application."},
              {title:"Use pre-application advice",body:"Most councils offer paid pre-application advice. Getting early feedback from a planning officer dramatically improves approval chances."},
              {title:"Hire an architect",body:"Good drawings make a huge difference. An architect experienced in local planning can design a scheme more likely to be approved."},
              {title:"Check local planning policy",body:"Each council has a Local Plan that guides decisions. Understanding local design policies helps frame your application appropriately."},
            ].map((tip) => (
              <div key={tip.title} className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="bg-blue-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Need an architect or planning consultant?</h2>
          <p className="text-blue-100 text-sm mb-5">Find trusted local professionals across the CV postcode area.</p>
          <Link href="/" className="inline-block px-6 py-2.5 bg-white text-blue-600 font-semibold text-sm rounded-xl hover:bg-blue-50 transition">Find a Tradesperson</Link>
        </div>
      </div>
    </div>
  );
}