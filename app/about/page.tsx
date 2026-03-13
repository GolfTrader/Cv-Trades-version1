export default function AboutPage() {
  return (
    <div className="container-page py-10 space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          About
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          About CV Trades
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          CV Trades is a modern, local directory built specifically for the CV
          postcode area, helping homeowners connect with trusted tradespeople.
        </p>
      </header>

      <div className="card max-w-3xl space-y-4 p-6 text-sm text-slate-600">
        <p>
          This page will share more detail about the mission, verification
          process, and how the directory operates. Later, this content can be
          managed via Supabase or a CMS.
        </p>
      </div>
    </div>
  );
}

