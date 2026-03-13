import type { Tradesperson } from "@/types/listing";
import { getAverageRating } from "@/lib/tradespeople";

interface FeaturedListingCardProps {
  listing: Tradesperson;
}

export function FeaturedListingCard({ listing }: FeaturedListingCardProps) {
  const reviews = listing.reviews ?? [];
  const avgRating = getAverageRating(reviews);
  const categories = listing.tradesperson_categories?.map((tc: any) => tc.categories?.name).filter(Boolean) ?? [];
  const areas = listing.tradesperson_areas?.map((ta: any) => ta.areas?.name).filter(Boolean) ?? [];

  return (
    <article className="card flex flex-col overflow-hidden border-primary/10">
      <div className="h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Featured
          </span>
          {reviews.length > 0 && (
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-1 text-xs font-medium text-amber-300">
              ⭐ {avgRating.toFixed(1)}
              <span className="text-slate-300">({reviews.length})</span>
            </div>
          )}
        </div>
        <div>
          {categories.length > 0 && (
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {categories[0]}
            </p>
          )}
          <h3 className="mt-1 text-base font-semibold text-slate-900">
            {listing.business_name}
          </h3>
          {areas.length > 0 && (
            <p className="text-xs text-slate-500">{areas.join(", ")}</p>
          )}
        </div>
        {listing.description && (
          <p className="line-clamp-2 text-sm text-slate-600">
            {listing.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-500">
          <span>{areas[0] ?? ""}</span>
          <button className="text-primary hover:underline">View Profile</button>
        </div>
      </div>
    </article>
  );
}
