export type TradeCategory =
  | "plumbing-heating"
  | "electrical"
  | "building"
  | "landscaping"
  | "plastering"
  | "roofing"
  | "decorating"
  | "kitchens"
  | "bathrooms"
  | "flooring"
  | "glazing"
  | "security"
  | "scaffolding"
  | "cleaning"
  | "waste";

export interface Listing {
  id: string;
  name: string;
  companyName: string;
  category: TradeCategory;
  area: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  tagline?: string;
}

