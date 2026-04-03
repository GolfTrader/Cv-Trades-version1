"use client";

import { useRouter } from "next/navigation";
import type { Tradesperson } from "@/types/listing";
import { getAverageRating } from "@/lib/tradespeople";

interface PremiumListingCardProps {
  listing: Tradesperson;
}

export function PremiumListingCard({ listing }: PremiumListingCardProps) {
  const router = useRouter();
  const reviews = listing.reviews ?? [];
  const avgRating = getAverageRating(reviews);
  const categories = listing.tradesperson_categories?.map((tc: any) => tc.categories?.name).filter(Boolean) ?? [];
  const areas = listing.tradesperson_areas?.map((ta: any) => ta.areas?.name).filter(Boolean) ?? [];
  const tradeBodies: string[] = listing.trade_bodies ?? [];

  return (
    <div onClick={() => router.push(`/trade/${listing.slug}`)} className="group block cursor-pointer">
      <div className="card flex flex-row items-start gap-4 p-4 transition-shadow hover:shadow-md">

        {/* Avatar / logo */}
        <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center text-lg font-bold text-slate-400 overflow-hidden">
          {listing.logo_url
            ? <img src={listing.logo_url} alt={listing.business_name} className="h-14 w-14 object-cover" />
            : listing.business_name?.charAt(0) ?? "?"}
        </div>

        {/* Main info */}
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          {categories.length > 0 && (
            <p className="text-xs font-medium uppercase tracking-wide text-primary">{categories[0]}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors truncate">
              {listing.business_name}
            </h3>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary flex-shrink-0">
              Premium
            </span>
          </div>
          {areas.length > 0 && <p className="text-xs text-slate-500">{areas.join(", ")}</p>}
          {listing.description && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">{listing.description}</p>
          )}
          {tradeBodies.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {tradeBodies.slice(0, 4).map((body) => (
                <span key={body} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  ✓ {body}
                </span>
              ))}
              {tradeBodies.length > 4 && (
                <span className="text-xs text-slate-400">+{tradeBodies.length - 4} more</span>
              )}
            </div>
          )}
        </div>

        {/* Right col: rating, phone, website, CTA */}
        <div className="flex flex-shrink-0 flex-col items-end gap-1.5 min-w-[120px]">
          {reviews.length > 0 ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              ⭐ {avgRating.toFixed(1)}<span className="text-slate-400">({reviews.length})</span>
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400">
              No reviews
            </div>
          )}
          {listing.main_phone && (
            <span className="text-xs font-medium text-slate-700">{listing.main_phone}</span>
          )}
          {listing.website && (
            <span className="text-xs text-slate-400 truncate max-w-[120px]">
              {listing.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </span>
          )}
          <span className="text-xs font-medium text-primary group-hover:underline">View Profile →</span>
        </div>

      </div>
    </div>
  );
}
