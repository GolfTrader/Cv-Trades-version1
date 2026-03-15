import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: tp } = await supabase
    .from("tradespeople")
    .select("business_name, description")
    .eq("slug", params.slug)
    .single();

  if (!tp) return { title: "Tradesperson | CV Trades Directory" };

  return {
    title: `${tp.business_name} | CV Trades Directory`,
    description: tp.description ?? `View the profile of ${tp.business_name} on CV Trades Directory.`,
    openGraph: {
      title: `${tp.business_name} | CV Trades Directory`,
      description: tp.description ?? `View the profile of ${tp.business_name} on CV Trades Directory.`,
    },
  };
}

export default async function TradeProfilePage({ params }: PageProps) {
  // Fetch core tradesperson data - no gallery join in case table doesn't exist
  const { data: tp, error } = await supabase
    .from("tradespeople")
    .select(`
      *,
      tradesperson_areas(areas(name)),
      tradesperson_categories(categories(name)),
      reviews(id, rating, reviewer_name, comment, created_at)
    `)
    .eq("slug", params.slug)
    .single();

  // Log error for debugging but don't 404 on db errors
  if (error) {
    console.error("Profile page error:", error.message, "slug:", params.slug);
    notFound();
  }

  if (!tp) notFound();

  const categories = tp.tradesperson_categories?.map((tc: any) => tc.categories?.name).filter(Boolean) ?? [];
  const areas = tp.tradesperson_areas?.map((ta: any) => ta.areas?.name).filter(Boolean) ?? [];
  const reviews = tp.reviews ?? [];

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : null;

  const socialLinks = [
    tp.website && { label: "Website", href: tp.website, icon: "🌐" },
    tp.facebook_url && { label: "Facebook", href: tp.facebook_url, icon: "📘" },
    tp.instagram_url && { label: "Instagram", href: tp.instagram_url, icon: "📸" },
    tp.youtube_url && { label: "YouTube", href: tp.youtube_url, icon: "▶️" },
    tp.linkedin_url && { label: "LinkedIn", href: tp.linkedin_url, icon: "💼" },
    tp.whatsapp_url && { label: "WhatsApp", href: `https://wa.me/${tp.whatsapp_url.replace(/\D/g, "")}`, icon: "💬" },
  ].filter(Boolean) as { label: string; href: string; icon: string }[];

  return (
    <div className="container-page py-10">

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>›</span>
        <Link href="/find-a-trade" className="hover:text-primary transition-colors">Find a Trade</Link>
        <span>›</span>
        <span className="text-slate-600">{tp.business_name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* Header card */}
          <div className="card overflow-hidden">
            {tp.is_featured && (
              <div className="bg-primary px-5 py-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-white">⭐ Featured Professional</span>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl font-bold text-slate-400">
                  {tp.logo_url
                    ? <img src={tp.logo_url} alt={tp.business_name} className="h-full w-full object-cover" />
                    : tp.business_name.charAt(0)
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl leading-tight">
                    {tp.business_name}
                  </h1>
                  {categories.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {categories.map((cat: string) => (
                        <span key={cat} className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  {areas.length > 0 && (
                    <p className="mt-1.5 text-sm text-slate-500">📍 {areas.join(", ")}</p>
                  )}
                  {avgRating !== null && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-sm ${s <= Math.round(avgRating) ? "text-amber-400" : "text-slate-200"}`}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">
                        {avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {tp.description && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <h2 className="text-sm font-semibold text-slate-900 mb-2">About</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{tp.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Customer Reviews
              {reviews.length > 0 && <span className="ml-2 font-normal text-slate-400">({reviews.length})</span>}
            </h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-400">No reviews yet — be the first!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r: any) => (
                  <div key={r.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-800">{r.reviewer_name || "Anonymous"}</span>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-xs ${s <= r.rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>}
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <aside className="space-y-5">
          <div className="card p-6 md:sticky md:top-24">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Contact</h2>
            <div className="space-y-3">
              {tp.main_phone && (
                <a href={`tel:${tp.main_phone}`} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors">
                  <span className="text-lg">📞</span>
                  <div>
                    <p className="text-xs text-slate-400">Main phone</p>
                    <p className="font-medium">{tp.main_phone}</p>
                  </div>
                </a>
              )}
              {tp.mobile_phone && (
                <a href={`tel:${tp.mobile_phone}`} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors">
                  <span className="text-lg">📱</span>
                  <div>
                    <p className="text-xs text-slate-400">Mobile</p>
                    <p className="font-medium">{tp.mobile_phone}</p>
                  </div>
                </a>
              )}
              {tp.email && (
                <a href={`mailto:${tp.email}`} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors">
                  <span className="text-lg">✉️</span>
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="font-medium truncate">{tp.email}</p>
                  </div>
                </a>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Online</p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-primary/30 hover:text-primary transition-colors">
                      <span>{link.icon}</span>{link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {areas.length > 0 && (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Areas Covered</p>
                <p className="text-sm text-slate-600">{areas.join(", ")}</p>
              </div>
            )}

            <div className="mt-5 border-t border-slate-100 pt-5">
              <Link href="/find-a-trade" className="block text-center text-xs font-medium text-primary hover:underline">
                ← Back to search
              </Link>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
