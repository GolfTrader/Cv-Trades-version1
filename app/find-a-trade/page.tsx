import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";
import { ListingCard } from "@/components/ListingCard";
import { supabase } from "@/lib/supabase";

interface FindATradePageProps {
  searchParams: { area?: string; category?: string };
}


export async function generateMetadata({ searchParams }: FindATradePageProps): Promise<Metadata> {
  const { area, category } = searchParams;
  
  const title = [
    category,
    area ? `in ${area}` : null,
    "| CV Trades Directory"
  ].filter(Boolean).join(" ") || "Find a Tradesperson | CV Trades Directory";

  const description = [
    "Find trusted",
    category?.toLowerCase() ?? "tradespeople",
    area ? `in ${area}` : "across the CV postcode area",
    "- vetted local professionals ready to help."
  ].join(" ");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}
export default async function FindATradePage({ searchParams }: FindATradePageProps) {
  const { area, category } = searchParams;

  let query = supabase
    .from("tradespeople")
    .select(`
      *,
      tradesperson_areas(areas(name)),
      tradesperson_categories(categories(name)),
      reviews(rating)
    `)
    .order("is_featured", { ascending: false });

  // Filter by area if provided
  if (area) {
    const { data: areaData } = await supabase
      .from("areas")
      .select("id")
      .eq("name", area)
      .single();

    if (areaData) {
      const { data: tradespersonIds } = await supabase
        .from("tradesperson_areas")
        .select("tradesperson_id")
        .eq("area_id", areaData.id);

      const ids = tradespersonIds?.map((t) => t.tradesperson_id) ?? [];
      query = query.in("id", ids.length > 0 ? ids : [-1]);
    }
  }

  // Filter by category if provided
  if (category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("name", category)
      .single();

    if (categoryData) {
      const { data: tradespersonIds } = await supabase
        .from("tradesperson_categories")
        .select("tradesperson_id")
        .eq("category_id", categoryData.id);

      const ids = tradespersonIds?.map((t) => t.tradesperson_id) ?? [];
      query = query.in("id", ids.length > 0 ? ids : [-1]);
    }
  }

  const { data: tradespeople, error } = await query;

  if (error) console.error("Error fetching tradespeople:", error);

  const results = tradespeople ?? [];

  return (
    <div>
      <section className="relative bg-gradient-to-b from-slate-50 via-sky-50/60 to-slate-50">
        <div className="container-page flex flex-col items-center pt-20 pb-16 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Find a Tradesperson
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
            Browse trusted local professionals across the CV postcode area.
          </p>
          <div className="mt-10 w-full max-w-5xl">
            <SearchBar showLabels defaultArea={area} defaultCategory={category} />
          </div>
        </div>
      </section>

      <section className="container-page mt-8 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {results.length === 0
              ? "No tradespeople found"
              : `${results.length} tradesperson${results.length !== 1 ? "s" : ""} found`}
            {area && <span> in <strong>{area}</strong></span>}
            {category && <span> for <strong>{category}</strong></span>}
          </p>
          {(area || category) && (
            <a href="/find-a-trade" className="text-sm text-primary hover:underline">
              Clear filters
            </a>
          )}
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-medium text-slate-700">No results found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your area or category filters.
            </p>
            <a href="/find-a-trade" className="btn-primary mt-6">
              Clear filters
            </a>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {results.map((person) => (
              <ListingCard key={person.id} listing={person} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
