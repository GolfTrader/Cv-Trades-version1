import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConditionalNewsletterPopup } from "@/components/ConditionalNewsletterPopup";

export const metadata: Metadata = {
  title: "CV Trades Directory",
  description: "Find trusted local tradespeople across the CV postcode area.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ConditionalNewsletterPopup />
      </body>
    </html>
  );
}
