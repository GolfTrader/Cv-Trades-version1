const faqs = [
  {
    question: "How are tradespeople vetted?",
    answer:
      "In the production version, all trades will be manually reviewed and verified before being published, using checks such as reviews, references, and accreditation."
  },
  {
    question: "Is CV Trades free to use?",
    answer:
      "Homeowners can browse and contact trades for free. Trades businesses may pay a listing fee or subscription to appear in the directory."
  },
  {
    question: "Which areas are covered?",
    answer:
      "We cover the wider CV postcode region including Coventry, Warwick, Leamington Spa, Nuneaton, and surrounding towns and villages."
  }
];

export default function FaqPage() {
  return (
    <div className="container-page py-10 space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Help
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Frequently Asked Questions
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Answers to common questions about how the CV Trades directory works.
        </p>
      </header>

      <div className="grid gap-4 md:max-w-3xl">
        {faqs.map((item) => (
          <div key={item.question} className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              {item.question}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

