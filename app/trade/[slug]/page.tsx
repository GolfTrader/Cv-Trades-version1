import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: { slug: string };
}

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
  const tradeBodies: string[] = tp.trade_bodies ?? [];

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : null;

  const isFeatured = tp.membership_tier === "featured";
  const isPremium = tp.membership_tier === "premium";

  const socialLinks = [
    tp.facebook_url && { label: "Facebook", href: tp.facebook_url },
    tp.instagram_url && { label: "Instagram", href: tp.instagram_url },
    tp.youtube_url && { label: "YouTube", href: tp.youtube_url },
    tp.linkedin_url && { label: "LinkedIn", href: tp.linkedin_url },
    tp.whatsapp_url && { label: "WhatsApp", href: `https://wa.me/${tp.whatsapp_url.replace(/\D/g, "")}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-24 pt-10">
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
              {/* Tier badge */}
              <div className="mb-3 flex flex-wrap gap-2">
                {isFeatured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-400/30 uppercase tracking-wide">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1l1.34 2.71 2.99.44-2.16 2.11.51 2.98L6 7.77 3.32 9.24l.51-2.98L1.67 4.15l2.99-.44L6 1z" fill="currentColor"/>
                    </svg>
                    Featured Professional
                  </span>
                )}
                {isPremium && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary border border-primary/30 uppercase tracking-wide">
                    Premium Member
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white md:text-4xl">{tp.business_name}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {categories.map((cat: string) => (
                  <span key={cat} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/90 border border-white/10">
                    {cat}
                  </span>
                ))}
                {areas.length > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-300">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0">
                      <path d="M6.5 1C4.567 1 3 2.567 3 4.5c0 2.625 3.5 6.5 3.5 6.5S10 7.125 10 4.5C10 2.567 8.433 1 6.5 1zm0 4.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" fill="currentColor"/>
                    </svg>
                    {areas.join(", ")}
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

      {/* Main content */}
      <div className="container-page -mt-12 pb-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">

          {/* LEFT */}
          <div className="space-y-5">

            {/* About */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 mb-3">About</h2>
              {tp.description
                ? <p className="text-sm text-slate-600 leading-relaxed">{tp.description}</p>
                : <p className="text-sm text-slate-400 italic">No description provided.</p>
              }
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

            {/* Trade Body Accreditations */}
            {tradeBodies.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-semibold text-slate-900 mb-4">Accreditations & Trade Bodies</h2>
                <div className="flex flex-wrap gap-2">
                  {tradeBodies.map((body: string) => (
                    <span key={body} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="7" fill="#10b981"/>
                        <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {body}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Areas covered */}
            {areas.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-semibold text-slate-900 mb-3">Areas Covered</h2>
                <div className="flex flex-wrap gap-2">
                  {areas.map((area: string) => (
                    <span key={area} className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 1C3.567 1 2 2.567 2 4.5c0 2.625 3.5 5.5 3.5 5.5S9 7.125 9 4.5C9 2.567 7.433 1 5.5 1zm0 4.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" fill="currentColor"/>
                      </svg>
                      {area}
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
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M11 2l2.09 4.26L18 7.27l-3.5 3.41.83 4.82L11 13.27l-4.33 2.23.83-4.82L4 7.27l4.91-.71L11 2z" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1"/>
                    </svg>
                  </div>
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
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 2.5h2.5l1 3L5 7a9 9 0 004 4l1.5-1.5 3 1V13A1.5 1.5 0 0112 14.5C6.2 14.5 1.5 9.8 1.5 4A1.5 1.5 0 013 2.5z" fill="white"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Main phone</p>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{tp.main_phone}</p>
                    </div>
                  </a>
                )}
                {tp.mobile_phone && (
                  <a href={`tel:${tp.mobile_phone}`}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-violet-600 flex items-center justify-center shadow-sm">
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                        <rect x="2" y="1" width="10" height="14" rx="2" stroke="white" strokeWidth="1.5"/>
                        <circle cx="7" cy="12.5" r="0.75" fill="white"/>
                        <path d="M5 3.5h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Mobile</p>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{tp.mobile_phone}</p>
                    </div>
                  </a>
                )}
                {tp.email && (
                  <a href={`mailto:${tp.email}`}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
                      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                        <rect x="1" y="1" width="14" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
                        <path d="M1.5 2L8 7l6.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors truncate max-w-[180px]">{tp.email}</p>
                    </div>
                  </a>
                )}
                {tp.website && (
                  <a href={tp.website.startsWith("http") ? tp.website : `https://${tp.website}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-sky-600 flex items-center justify-center shadow-sm">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.5"/>
                        <path d="M8 1.5c-1.5 2-2.5 3.8-2.5 6.5s1 4.5 2.5 6.5M8 1.5c1.5 2 2.5 3.8 2.5 6.5s-1 4.5-2.5 6.5M1.5 8h13" stroke="white" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Website</p>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors truncate max-w-[180px]">
                        {tp.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </p>
                    </div>
                  </a>
                )}
              </div>

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Social</p>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((link) => {
                      const icons: Record<string, JSX.Element> = {
                        Facebook: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 2.5H10V.5H8.5C7.1 .5 6 1.6 6 3v1H4.5v2H6v6h2V6h1.5l.5-2H8V3c0-.3.2-.5.5-.5z" fill="currentColor"/></svg>,
                        Instagram: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="10.5" cy="3.5" r="0.75" fill="currentColor"/></svg>,
                        YouTube: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5.5 5l4 2-4 2V5z" fill="currentColor"/></svg>,
                        LinkedIn: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M4 6v4M4 4.5v.01M7 10V7.5c0-.8.7-1.5 1.5-1.5S10 6.7 10 7.5V10M7 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
                        WhatsApp: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M4.5 4.5c1.5-.5 4 .5 4.5 3-.5 2-2 2.5-3 2l-2 1 .5-2C3.5 7 4 5.5 4.5 4.5z" stroke="currentColor" strokeWidth="1.2"/></svg>,
                      };
                      return (
                        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all">
                          {icons[link.label]}
                          {link.label}
                        </a>
                      );
                    })}
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
