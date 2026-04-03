import { SearchBar } from "@/components/SearchBar";
import { FeaturedListingCard } from "@/components/FeaturedListingCard";
import { getFeaturedTradespeople } from "@/lib/tradespeople";
import { AREAS } from "@/lib/data";
import Link from "next/link";

export default async function HomePage() {
  const featuredTradespeople = await getFeaturedTradespeople();

  return (
    <div>

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">

        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] rounded-full pointer-events-none"
          style={{ background: "rgba(37,99,235,0.18)", filter: "blur(70px)" }} />

        <div className="absolute top-10 right-0 w-[320px] h-[220px] rounded-full pointer-events-none"
          style={{ background: "rgba(6,182,212,0.09)", filter: "blur(60px)" }} />

        <div className="container-page relative pt-10 pb-8 md:pt-14 md:pb-10">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              Trusted by homeowners across Coventry &amp; Warwickshire
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-black text-white leading-tight sm:text-5xl md:text-6xl">
            Find trusted trades<br />
            for the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              CV postcode
            </span>{" "}
            area
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
            The modern, reliable directory for the CV postcode area. Connect
            with top-rated local professionals vetted by your community.
          </p>

          <div id="search" className="relative mt-8 w-full max-w-4xl" style={{ zIndex: 100 }}>
            <div className="rounded-2xl bg-white shadow-2xl shadow-black/40 ring-1 ring-blue-500/20">
              <SearchBar />
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 bg-white/[0.03]">
          <div className="container-page py-5 flex items-center justify-between flex-wrap gap-4">
            {[
              { value: "CV1 – CV47", label: "Postcode area" },
              { value: "100%", label: "Local homeowners" },
              { value: "Free", label: "To get listed" },
              { value: "Vetted", label: "Every tradesperson" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-black text-blue-400">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROFESSIONALS */}
      {featuredTradespeople.length > 0 && (
        <section className="container-page mt-12 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5l1.545 3.13 3.455.502-2.5 2.437.59 3.441L7 9.385l-3.09 1.625.59-3.44L2 5.132l3.455-.502L7 1.5z" fill="#f59e0b"/>
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Featured</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 md:text-2xl">
              Featured Professionals
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top-rated tradespeople in the CV area, vetted and highly recommended.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredTradespeople.map((listing) => (
              <FeaturedListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* AREAS */}
      <section className="mt-16 bg-gradient-to-b from-slate-900 to-slate-950 py-14 text-slate-100">
        <div className="container-page space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-black md:text-3xl">
              Covering the entire CV Postcode
            </h2>
            <p className="max-w-2xl text-sm text-slate-400 md:text-base leading-relaxed">
              We&apos;re building the most comprehensive network of trades professionals
              across Warwickshire and Coventry. Search by town or village to find trusted local experts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((area) => (
              <span key={area}
                className="rounded-full bg-slate-800 border border-slate-700 px-4 py-1.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-default">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOR TRADESPEOPLE CTA */}
      <section className="container-page py-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">For Tradespeople</p>
            <h2 className="text-2xl font-black md:text-3xl leading-tight">
              Grow your business<br />across Coventry &amp; Warwickshire
            </h2>
            <p className="mt-3 text-blue-100 text-sm leading-relaxed max-w-md">
              Join CV Trades Directory and get in front of homeowners actively searching for your services. Free listing available — Featured from £75/month.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link href="/advertise"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-blue-700 font-bold text-sm px-8 py-4 hover:bg-blue-50 transition-colors shadow-lg whitespace-nowrap">
              Get listed today →
            </Link>
            <p className="text-xs text-blue-200 text-center">Free listing available. No card required.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
