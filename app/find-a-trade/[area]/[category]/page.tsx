import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeaturedListingCard } from "@/components/FeaturedListingCard";
import { PremiumListingCard } from "@/components/PremiumListingCard";
import { FreeListingCard } from "@/components/FreeListingCard";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: { area: string; category: string };
}

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function deduplicateById<T extends { id: number }>(data: T[]): T[] {
  const seen = new Set<number>();
  return data.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const area = slugToName(decodeURIComponent(params.area));
  const category = slugToName(decodeURIComponent(params.category));
  const isAll = (s: string) => s.toLowerCase() === "all";
  const title =
    [
      !isAll(category) ? category : null,
      !isAll(area) ? `in ${area}` : null,
      "| CV Trades Directory",
    ]
      .filter(Boolean)
      .join(" ") || "Find a Tradesperson | CV Trades Directory";
  const description = `Find trusted ${isAll(category) ? "tradespeople" : category.toLowerCase()} ${
    isAll(area) ? "across the CV postcode area" : `in ${area}`
  }. Browse vetted local professionals.`;
  return { title, description, openGraph: { title, description } };
}

export default async function FindATradeResultsPage({ params }: PageProps) {
  const area = slugToName(decodeURIComponent(params.area));
  const category = slugToName(decodeURIComponent(params.category));
  const isAll = (s: string) => s.toLowerCase() === "all";

  let areaIds: number[] | null = null;
  if (!isAll(area)) {
    const { data: areaData } = await supabase
      .from("areas")
      .select("id")
      .eq("name", area)
      .single();
    if (!areaData) notFound();
    const { data: tpAreas } = await supabase
      .from("tradesperson_areas")
      .select("tradesperson_id")
      .eq("area_id", areaData.id);
    areaIds = tpAreas?.map((t) => t.tradesperson_id) ?? [];
  }

  let categoryIds: number[] | null = null;
  if (!isAll(category)) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("name", category)
      .single();
    if (!categoryData) notFound();
    const { data: tpCategories } = await supabase
      .from("tradesperson_categories")
      .select("tradesperson_id")
      .eq("category_id", categoryData.id);
    categoryIds = tpCategories?.map((t) => t.tradesperson_id) ?? [];
  }

  let filteredIds: number[] | null = null;
  if (areaIds !== null && categoryIds !== null) {
    filteredIds = areaIds.filter((id) => categoryIds!.includes(id));
  } else if (areaIds !== null) {
    filteredIds = areaIds;
  } else if (categoryIds !== null) {
    filteredIds = categoryIds;
  }

  let query = supabase
    .from("tradespeople")
    .select(
      `*, tradesperson_areas(areas(name)), tradesperson_categories(categories(name)), reviews(rating)`
    )
    .eq("approved", true)
    .order("membership_tier", { ascending: true });

  if (filteredIds !== null) {
    query = query.in("id", filteredIds.length > 0 ? filteredIds : [-1]);
  }

  const { data: raw, error } = await query;
  if (error) console.error("Error fetching tradespeople:", error);

  const tradespeople = deduplicateById(raw ?? []);

  const tierOrder: Record<string, number> = { featured: 0, premium: 1, free: 2 };
  const sorted = [...tradespeople].sort(
    (a, b) => (tierOrder[a.membership_tier] ?? 3) - (tierOrder[b.membership_tier] ?? 3)
  );

  const featured = sorted.filter((t) => t.membership_tier === "featured");
  const premium = sorted.filter((t) => t.membership_tier === "premium");
  const free = sorted.filter((t) => t.membership_tier === "free" || !t.membership_tier);

  const headingArea = isAll(area) ? "the CV area" : area;
  const headingCategory = isAll(category) ? "Tradespeople" : category;
  const totalCount = tradespeople.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-page py-8">
          <p className="text-sm text-blue-600 font-medium mb-1">Find a Trade</p>
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
            {headingCategory} in {headingArea}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalCount === 0 ? (
              "No tradespeople found"
            ) : (
              <>
                {totalCount} tradesperson{totalCount !== 1 ? "s" : ""} found
              </>
            )}
            {" · "}
            <a href="/" className="text-blue-600 hover:underline">
              Change search
            </a>
          </p>
        </div>
      </div>

      <div className="container-page py-10 space-y-10">
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-2">No results found</p>
            <p className="text-sm text-gray-500 mb-6">
              Try adjusting your area or category filters.
            </p>
            <a href="/find-a-trade" className="btn-primary">
              New search
            </a>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1.5l1.545 3.13 3.455.502-2.5 2.437.59 3.441L8 9.385l-3.09 1.625.59-3.44L3 4.632l3.455-.502L8 1.5z"
                        fill="#2563eb"
                      />
                    </svg>
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                      Featured Businesses
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-blue-100" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((person) => (
                    <FeaturedListingCard key={person.id} listing={person} />
                  ))}
                </div>
              </section>
            )}

            {premium.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                      Premium Listings
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="space-y-3">
                  {premium.map((person) => (
                    <PremiumListingCard key={person.id} listing={person} />
                  ))}
                </div>
              </section>
            )}

            {free.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                      Other Listings
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="space-y-2">
                  {free.map((person) => (
                    <FreeListingCard key={person.id} listing={person} />
                  ))}
                </div>
              </section>
            )}

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white text-center">
              <p className="font-bold text-lg mb-1">Are you a {headingCategory}?</p>
              <p className="text-blue-100 text-sm mb-4">
                Get your business in front of customers across Coventry &amp; Warwickshire
              </p>
              <a
                href="/advertise"
                className="inline-block bg-white text-blue-600 font-bold text-sm rounded-xl px-6 py-2.5 hover:bg-blue-50 transition-colors"
              >
                List your business
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
