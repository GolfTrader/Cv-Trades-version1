import Link from "next/link";
import type { Tradesperson } from "@/types/listing";
import { getAverageRating } from "@/lib/tradespeople";

interface ListingCardProps {
  listing: Tradesperson;
}

export function ListingCard({ listing }: ListingCardProps) {
  const reviews = listing.reviews ?? [];
  const avgRating = getAverageRating(reviews);
  const categories = listing.tradesperson_categories?.map((tc: any) => tc.categories?.name).filter(Boolean) ?? [];
  const areas = listing.tradesperson_areas?.map((ta: any) => ta.areas?.name).filter(Boolean) ?? [];

  return (
    <Link href={`/trade/${listing.slug}`} className="group block">
      <article className="card flex flex-row items-center gap-4 p-4 transition-shadow hover:shadow-md">
        {/* Avatar */}
        <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center text-lg font-bold text-slate-400">
          {listing.business_name?.charAt(0) ?? "?"}
        </div>

        {/* Main info */}
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          {categories.length > 0 && (
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {categories[0]}
            </p>
          )}
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors truncate">
            {listing.business_name}
          </h3>
          {areas.length > 0 && (
            <p className="text-xs text-slate-500">{areas.join(", ")}</p>
          )}
          {listing.description && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">
              {listing.description}
            </p>
          )}
        </div>

        {/* Rating + CTA */}
        <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
          {reviews.length > 0 ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              ⭐ {avgRating.toFixed(1)}
              <span className="text-slate-400">({reviews.length})</span>
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400">
              No reviews
            </div>
          )}
          <span className="text-xs font-medium text-primary group-hover:underline">
            View Profile →
          </span>
        </div>
      </article>
    </Link>
  );
}
