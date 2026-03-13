export default function AdvertisePage() {
  return (
    <div className="container-page py-10 space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Join the directory
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Advertise your trade business
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          List your business in the CV Trades directory to reach homeowners
          across Coventry, Warwickshire, and the wider CV postcode area.
        </p>
      </header>

      <div className="card max-w-2xl p-6">
        <p className="text-sm text-slate-600">
          A simple onboarding form will be added here once Supabase is
          connected. For now, this page outlines the benefits of joining the
          directory.
        </p>
      </div>
    </div>
  );
}

