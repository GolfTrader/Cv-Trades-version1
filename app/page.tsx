import { SearchBar } from "@/components/SearchBar";
import { FeaturedListingCard } from "@/components/FeaturedListingCard";
import { getFeaturedTradespeople } from "@/lib/tradespeople";
import { AREAS } from "@/lib/data";

export default async function HomePage() {
  const featuredTradespeople = await getFeaturedTradespeople();
  
  return (
    <div>
      <section className="relative bg-gradient-to-b from-slate-50 via-sky-50/60 to-slate-50">
        <div className="container-page flex flex-col items-center pt-28 pb-24 text-center md:pt-22 md:pb-30 min-h-[60vh]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:text-sm md:text-lg">
            Find a trusted local professional
          </p>
          <h1 className="mt-8 max-w-4xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
            Find trusted trades for the{" "}
            <span className="text-primary">CV postcode</span> area
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
            The modern, reliable directory for the CV postcode area. Connect
            with top-rated local professionals for your next project.
          </p>

          {/* Search box — 15% bigger, max-w-6xl instead of max-w-5xl, more padding around it */}
          <div id="search" className="mt-12 w-full max-w-6xl px-2 md:mt-20">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="container-page mt-6 space-y-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
              Featured Professionals
            </h2>
            <p className="text-sm text-slate-600">
              Top-rated tradespeople in the CV area, vetted and highly
              recommended by your local community.
            </p>
          </div>
          <button className="text-sm font-medium text-primary hover:underline">
            View all tradespeople
          </button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featuredTradespeople.map((listing) => (
            <FeaturedListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="mt-16 bg-gradient-to-b from-slate-900 to-slate-950 py-14 text-slate-100">
        <div className="container-page space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Covering the entire CV Postcode
            </h2>
            <p className="max-w-2xl text-sm text-slate-300 md:text-base">
              We're building the most comprehensive network of trades professionals across Coventry and 
		Warwickshire. We've devided the CV postcode into areas to help you find trusted local experts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((area) => (
              <span
                key={area}
                className="rounded-full bg-slate-800 px-4 py-1.5 text-sm text-slate-100"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
