import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: { slug: string };
}

// Force fresh data on every request — no stale cache
export const revalidate = 0;
export const dynamic = "force-dynamic";

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
  const { data: tp, error } = await supabase
    .from("tradespeople")
    .select(`
      *,
      tradesperson_areas(areas(id, name)),
      tradesperson_categories(categories(id, name)),
      reviews(id, rating, reviewer_name, comment, created_at)
    `)
    .eq("slug", params.slug)
    .single();

  if (error) {
    console.error("Profile page error:", error.message, "slug:", params.slug);
    notFound();
  }
  if (!tp) notFound();

  const categories = tp.tradesperson_categories
    ?.map((tc: any) => tc.categories?.name)
    .filter(Boolean) ?? [];

  const areas = tp.tradesperson_areas
    ?.map((ta: any) => ta.areas?.name)
    .filter(Boolean) ?? [];

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
    <div className="min-h-screen bg-slate-50">

      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-24 pt-10">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <div className="container-page relative">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-slate-300">{tp.business_name}</span>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            {/* Logo */}
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-white/10 bg-white/10 flex items-center justify-center text-3xl font-bold text-white shadow-xl md:h-24 md:w-24">
              {tp.logo_url
                ? <img src={tp.logo_url} alt={tp.business_name} className="h-full w-full object-cover" />
                : <span className="text-white/80">{tp.business_name.charAt(0)}</span>
              }
            </div>

            {/* Name + meta */}
            <div className="flex-1">
              {tp.is_featured && (
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary border border-primary/30">
                  ⭐ Featured Professional
                </span>
              )}
              <h1 className="text-3xl font-bold text-white md:text-4xl">{tp.business_name}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {categories.map((cat: string) => (
                  <span key={cat} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/90 border border-white/10">
                    {cat}
                  </span>
                ))}
                {areas.length > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-300">
                    <span>📍</span> {areas.join(", ")}
                  </span>
                )}
              </div>

              {avgRating !== null && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-lg ${s <= Math.round(avgRating) ? "text-amber-400" : "text-white/20"}`}>★</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-white">{avgRating.toFixed(1)}</span>
                  <span className="text-sm text-slate-400">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content — pulled up over the hero */}
      <div className="container-page -mt-12 pb-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">

          {/* LEFT */}
          <div className="space-y-5">

            {/* About card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 mb-3">About</h2>
              {tp.description
                ? <p className="text-sm text-slate-600 leading-relaxed">{tp.description}</p>
                : <p className="text-sm text-slate-400 italic">No description provided.</p>
              }

              {/* Quick stats row */}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-lg font-bold text-primary">{areas.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Areas Covered</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-lg font-bold text-primary">{categories.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Trade{categories.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-lg font-bold text-primary">{reviews.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Review{reviews.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-lg font-bold text-primary">{avgRating ? avgRating.toFixed(1) : "—"}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Avg Rating</p>
                </div>
              </div>
            </div>

            {/* Areas covered */}
            {areas.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-semibold text-slate-900 mb-3">Areas Covered</h2>
                <div className="flex flex-wrap gap-2">
                  {areas.map((area: string) => (
                    <span key={area} className="rounded-full bg-primary/8 border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary">
                      📍 {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                Customer Reviews
                {reviews.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-400">({reviews.length})</span>
                )}
              </h2>

              {reviews.length === 0 ? (
                <div className="rounded-xl bg-slate-50 py-8 text-center">
                  <p className="text-2xl mb-2">⭐</p>
                  <p className="text-sm font-medium text-slate-700">No reviews yet</p>
                  <p className="text-xs text-slate-400 mt-1">Be the first to leave a review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {(r.reviewer_name || "A").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-slate-800">{r.reviewer_name || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={`text-sm ${s <= r.rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
                          ))}
                        </div>
                      </div>
                      {r.comment && <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>}
                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — sticky contact card */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 lg:sticky lg:top-24">

              <h2 className="text-base font-semibold text-slate-900 mb-4">Get in Touch</h2>

              <div className="space-y-3">
                {tp.main_phone && (
                  <a href={`tel:${tp.main_phone}`}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-base">📞</div>
                    <div>
                      <p className="text-xs text-slate-400">Main phone</p>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{tp.main_phone}</p>
                    </div>
                  </a>
                )}
                {tp.mobile_phone && (
                  <a href={`tel:${tp.mobile_phone}`}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-base">📱</div>
                    <div>
                      <p className="text-xs text-slate-400">Mobile</p>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{tp.mobile_phone}</p>
                    </div>
                  </a>
                )}
                {tp.email && (
                  <a href={`mailto:${tp.email}`}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-base">✉️</div>
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors truncate max-w-[180px]">{tp.email}</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Online</p>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((link) => (
                      <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all">
                        <span>{link.icon}</span>{link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to search */}
              <div className="mt-5 border-t border-slate-100 pt-5">
                <Link href="/"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-medium text-slate-500 hover:border-primary/30 hover:text-primary transition-all">
                  ← Back to search
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
