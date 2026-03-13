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
  slug: string;
  // joined from related tables
  areas?: { name: string }[];
  categories?: { name: string }[];
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