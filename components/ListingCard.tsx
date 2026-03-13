import type { Listing } from "@/types/listing";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            <span>⭐ {listing.rating.toFixed(1)}</span>
            <span className="text-slate-400">({listing.reviewCount})</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {listing.category.replace("-", " ")}
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">
            {listing.companyName}
          </h3>
          <p className="text-xs text-slate-500"> {listing.name}</p>
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

