import { supabase } from "@/lib/supabase";
import type { Tradesperson } from "@/types/listing";

export async function getFeaturedTradespeople(): Promise<Tradesperson[]> {
  const { data, error } = await supabase
    .from("tradespeople")
    .select(`
      *,
      tradesperson_areas(areas(name)),
      tradesperson_categories(categories(name)),
      reviews(rating)
    `)
    .eq("approved", true)
    .eq("membership_tier", "featured")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching featured tradespeople:", error);
    return [];
  }

  // Deduplicate by id in case joins cause duplicate rows
  const seen = new Set<number>();
  const unique = (data ?? []).filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return unique;
}

export async function getAllTradespeople(): Promise<Tradesperson[]> {
  const { data, error } = await supabase
    .from("tradespeople")
    .select(`
      *,
      tradesperson_areas(areas(name)),
      tradesperson_categories(categories(name)),
      reviews(rating)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tradespeople:", error);
    return [];
  }

  const seen = new Set<number>();
  return (data ?? []).filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export async function getTradespersonBySlug(slug: string): Promise<Tradesperson | null> {
  const { data, error } = await supabase
    .from("tradespeople")
    .select(`
      *,
      tradesperson_areas(areas(name)),
      tradesperson_categories(categories(name)),
      reviews(rating, reviewer_name, comment)
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching tradesperson:", error);
    return null;
  }

  return data;
}

export function getAverageRating(reviews: { rating: number }[]): number {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}