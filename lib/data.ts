import type { Listing, TradeCategory } from "@/types/listing";

export const AREAS: string[] = [
  "Coventry",
  "Kenilworth",
  "Leamington Spa",
  "Warwick",
  "Stratford",
  "Bedworth",
  "Nuneaton",
  "Atherstone",
  "Southam"
];

export const CATEGORIES: { id: TradeCategory; label: string }[] = [
  { id: "plumbing", label: "Plumbing" },
  { id: "electrical", label: "Electrical" },
  { id: "building", label: "Building" },
  { id: "landscaping", label: "Landscaping" },
  { id: "plastering", label: "Plastering" },
  { id: "roofing", label: "Roofing" },
  { id: "decorating", label: "Decorating" },
  { id: "kitchens", label: "Kitchens" },
  { id: "bathrooms", label: "Bathrooms" },
  { id: "flooring", label: "Flooring" },
  { id: "glazing", label: "Glazing" },
  { id: "security", label: "Security" },
  { id: "scaffolding", label: "Scaffolding" },
  { id: "cleaning", label: "Cleaning" },
  { id: "waste", label: "Waste" }
];

export const FEATURED_LISTINGS: Listing[] = [
  {
    id: "cv-plumbing-heating",
    name: "John Smith",
    companyName: "CV Plumbing & Heating",
    category: "plumbing-heating",
    area: "Coventry",
    rating: 4.9,
    reviewCount: 124,
    isFeatured: true,
    tagline:
      "Expert plumbing and heating services with over 15 years of experience."
  },
  {
    id: "warwickshire-electrics",
    name: "Sarah Jenkins",
    companyName: "Warwickshire Electrics",
    category: "electrical",
    area: "Leamington Spa",
    rating: 5.0,
    reviewCount: 89,
    isFeatured: true,
    tagline: "Reliable NICEIC-approved electricians for all domestic work."
  },
  {
    id: "davies-building-services",
    name: "Mike Davies",
    companyName: "Davies Building Services",
    category: "building",
    area: "Nuneaton",
    rating: 4.8,
    reviewCount: 210,
    isFeatured: true,
    tagline: "Extensions, loft conversions, and general building work."
  }
];

