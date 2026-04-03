"use client";

import { useRouter } from "next/navigation";
import type { Tradesperson } from "@/types/listing";
import { getAverageRating } from "@/lib/tradespeople";

interface FeaturedListingCardProps {
  listing: Tradesperson;
}

export function FeaturedListingCard({ listing }: FeaturedListingCardProps) {
  const router = useRouter();
  const reviews = listing.reviews ?? [];
  const avgRating = getAverageRating(reviews);
  const categories = listing.tradesperson_categories?.map((tc: any) => tc.categories?.name).filter(Boolean) ?? [];
  const areas = listing.tradesperson_areas?.map((ta: any) => ta.areas?.name).filter(Boolean) ?? [];
  const tradeBodies: string[] = listing.trade_bodies ?? [];

  return (
    <div onClick={() => router.push(`/trade/${listing.slug}`)} className="group block cursor-pointer">
      <div className="card flex flex-col overflow-hidden border-primary/10 transition-shadow hover:shadow-lg">

        <div className="h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

        <div className="flex flex-1 flex-col gap-3 p-4">

          {/* Featured badge + rating */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-500 border border-amber-300 uppercase tracking-wide">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M6 1l1.34 2.71 2.99.44-2.16 2.11.51 2.98L6 7.77 3.32 9.24l.51-2.98L1.67 4.15l2.99-.44L6 1z" fill="currentColor"/>
              </svg>
              Featured
            </span>
            {reviews.length > 0 && (
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-1 text-xs font-medium text-amber-300">
                ⭐ {avgRating.toFixed(1)}
                <span className="text-slate-300">({reviews.length})</span>
              </div>
            )}
          </div>

          {/* Category, name, areas */}
          <div>
            {categories.length > 0 && (
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{categories[0]}</p>
            )}
            <h3 className="mt-1 text-base font-semibold text-slate-900 group-hover:text-primary transition-colors">
              {listing.business_name}
            </h3>
            {areas.length > 0 && (
              <p className="text-xs text-slate-500">{areas.join(", ")}</p>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <p className="line-clamp-2 text-sm text-slate-600">{listing.description}</p>
          )}

          {/* Trade body badges */}
          {tradeBodies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tradeBodies.slice(0, 3).map((body) => (
                <span key={body} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  ✓ {body}
                </span>
              ))}
              {tradeBodies.length > 3 && (
                <span className="text-xs text-slate-400">+{tradeBodies.length - 3} more</span>
              )}
            </div>
          )}

          {/* Phone + website */}
          <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-2">
            <div className="flex items-center gap-4">
              {listing.main_phone && (
                <span className="font-medium text-slate-700">{listing.main_phone}</span>
              )}
              {listing.website && (
                <span className="text-slate-500 truncate max-w-[140px]">
                  {listing.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </span>
              )}
            </div>
            <span className="text-primary group-hover:underline flex-shrink-0">View Profile →</span>
          </div>

        </div>
      </div>
    </div>
  );
}
