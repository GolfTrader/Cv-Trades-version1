"use client";

import { useRouter } from "next/navigation";
import type { Tradesperson } from "@/types/listing";

interface FreeListingCardProps {
  listing: Tradesperson;
}

export function FreeListingCard({ listing }: FreeListingCardProps) {
  const router = useRouter();
  const categories = listing.tradesperson_categories?.map((tc: any) => tc.categories?.name).filter(Boolean) ?? [];
  const areas = listing.tradesperson_areas?.map((ta: any) => ta.areas?.name).filter(Boolean) ?? [];

  return (
    <div onClick={() => router.push(`/trade/${listing.slug}`)} className="group block cursor-pointer">
      <div className="card flex flex-row items-center gap-4 p-3 transition-shadow hover:shadow-sm">

        {/* Avatar */}
        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-400">
          {listing.business_name?.charAt(0) ?? "?"}
        </div>

        {/* Name + meta */}
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors truncate">
              {listing.business_name}
            </h3>
            <span className="text-xs text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 flex-shrink-0">
              Free listing
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {categories.length > 0 && <span>{categories[0]}</span>}
            {categories.length > 0 && areas.length > 0 && <span>·</span>}
            {areas.length > 0 && <span>{areas.join(", ")}</span>}
          </div>
        </div>

        {/* Phone + website + arrow */}
        <div className="hidden sm:flex flex-shrink-0 items-center gap-4 text-xs text-slate-500">
          {listing.main_phone && (
            <span className="font-medium text-slate-700">{listing.main_phone}</span>
          )}
          {listing.website && (
            <span className="text-slate-400 truncate max-w-[120px]">
              {listing.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </span>
          )}
          <span className="font-medium text-slate-400 group-hover:text-primary transition-colors">→</span>
        </div>

      </div>
    </div>
  );
}
