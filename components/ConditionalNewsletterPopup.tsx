"use client";
import { usePathname } from "next/navigation";
import { NewsletterPopup } from "@/components/NewsletterPopup";

export function ConditionalNewsletterPopup() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <NewsletterPopup />;
}
