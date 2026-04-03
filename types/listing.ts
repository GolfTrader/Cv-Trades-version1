export interface Tradesperson {
  id: number;
  created_at: string;
  business_name: string;
  description: string | null;
  main_phone: string | null;
  mobile_phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  whatsapp_url: string | null;
  instagram_url: string | null;
  is_featured: boolean;
  membership_tier: "free" | "premium" | "featured";
  billing_cycle: "monthly" | "annual";
  trade_bodies: string[] | null;
  slug: string;
  // joined from related tables
  tradesperson_areas?: { areas: { name: string } | null }[];
  tradesperson_categories?: { categories: { name: string } | null }[];
  reviews?: { rating: number }[];
}

// Keep Listing as an alias for backwards compatibility with existing components
export type Listing = Tradesperson;

export type TradeCategory =
  | "Plumbing"
  | "Electrical"
  | "Building"
  | "Landscaping"
  | "Plastering"
  | "Roofing"
  | "Decorating"
  | "Kitchens"
  | "Bathrooms"
  | "Flooring"
  | "Glazing"
  | "Security"
  | "Scaffolding"
  | "Cleaning"
  | "Waste";
