interface TradeProfilePageProps {
  params: {
    category: string;
    area: string;
    slug: string;
  };
}

export default function TradeProfilePage({ params }: TradeProfilePageProps) {
  const { category, area, slug } = params;

  return (
    <div className="container-page py-10 space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Trade profile
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          {slug.replace("-", " ")}
        </h1>
        <p className="text-sm text-slate-600">
          {category.replace("-", " ")} in {area}
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              About the Business
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Business details, description, and services will be loaded here
              from Supabase.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Customer Reviews
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Customer reviews and ratings will appear here once Supabase
              integration is implemented.
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Contact Details
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Contact information will be loaded here from Supabase.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

