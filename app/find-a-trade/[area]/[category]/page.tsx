import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { FeaturedListingCard } from "@/components/FeaturedListingCard";
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const area = slugToName(decodeURIComponent(params.area));
  const category = slugToName(decodeURIComponent(params.category));
  const isAll = (s: string) => s.toLowerCase() === "all";

  const title = [
    !isAll(category) ? category : null,
    !isAll(area) ? `in ${area}` : null,
    "| CV Trades Directory",
  ].filter(Boolean).join(" ") || "Find a Tradesperson | CV Trades Directory";

  const description = `Find trusted ${isAll(category) ? "tradespeople" : category.toLowerCase()} ${isAll(area) ? "across the CV postcode area" : `in ${area}`}. Browse vetted local professionals.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function FindATradeResultsPage({ params }: PageProps) {
  const area = slugToName(decodeURIComponent(params.area));
  const category = slugToName(decodeURIComponent(params.category));
  const isAll = (s: string) => s.toLowerCase() === "all";

  // Resolve area to tradesperson IDs
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

  // Resolve category to tradesperson IDs
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

  // Intersect IDs if both filters active
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
    .select(`
      *,
      tradesperson_areas(areas(name)),
      tradesperson_categories(categories(name)),
      reviews(rating)
    `)
    .order("is_featured", { ascending: false });

  if (filteredIds !== null) {
    query = query.in("id", filteredIds.length > 0 ? filteredIds : [-1]);
  }

  const { data: tradespeople, error } = await query;
  if (error) console.error("Error fetching tradespeople:", error);

  const results = tradespeople ?? [];
  const featured = results.filter((t) => t.is_featured);
  const standard = results.filter((t) => !t.is_featured);

  const headingArea = isAll(area) ? "the CV area" : area;
  const headingCategory = isAll(category) ? "Tradespeople" : category;

  return (
    <div className="container-page py-10">

      {/* Page title + result count */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {headingCategory} in {headingArea}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {results.length === 0 ? (
            "No tradespeople found"
          ) : (
            <>
              {results.length} tradesperson{results.length !== 1 ? "s" : ""} found
            </>
          )}
          {" · "}
          <a href="/find-a-trade" className="text-primary hover:underline">
            Change search
          </a>
        </p>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-slate-700">No results found</p>
          <p className="mt-2 text-sm text-slate-500">
            Try adjusting your area or category filters.
          </p>
          <a href="/find-a-trade" className="btn-primary mt-6">
            New search
          </a>
        </div>
      ) : (
        <div className="space-y-10">

          {/* Featured — 3 cards side by side */}
          {featured.length > 0 && (
            <div>
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                ⭐ Featured Professionals
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                {featured.map((person) => (
                  <FeaturedListingCard key={person.id} listing={person} />
                ))}
              </div>
            </div>
          )}

          {/* Standard — list view */}
          {standard.length > 0 && (
            <div>
              {featured.length > 0 && (
                <h2 className="mb-4 text-base font-semibold text-slate-900">
                  All Tradespeople
                </h2>
              )}
              <div className="flex flex-col gap-3">
                {standard.map((person) => (
                  <ListingCard key={person.id} listing={person} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
