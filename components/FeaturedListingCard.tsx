import type { Listing } from "@/types/listing";

interface FeaturedListingCardProps {
  listing: Listing;
}

export function FeaturedListingCard({ listing }: FeaturedListingCardProps) {
  return (
    <article className="card flex flex-col overflow-hidden border-primary/10">
      <div className="h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Featured
          </span>
          <div className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-1 text-xs font-medium text-amber-300">
            ⭐ {listing.rating.toFixed(1)}
            <span className="text-slate-300">({listing.reviewCount})</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {listing.category.replace("-", " ")}
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">
            {listing.companyName}
          </h3>
          <p className="text-xs text-slate-500">{listing.name}</p>
        </div>
        {listing.tagline && (
          <p className="line-clamp-2 text-sm text-slate-600">
            {listing.tagline}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-500">
          <span>{listing.area}</span>
          <button className="text-primary hover:underline">View Profile</button>
        </div>
      </div>
    </article>
  );
}

