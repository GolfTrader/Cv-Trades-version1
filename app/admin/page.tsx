"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/* ────────────────────────────────────────────
   TYPES
   ──────────────────────────────────────────── */
type Tradesperson = {
  id: number;
  business_name: string;
  email: string;
  main_phone: string;
  mobile_phone?: string;
  membership_tier: string;
  approved: boolean;
  created_at: string;
  logo_url?: string;
  description?: string;
};

type Review = {
  id: number;
  reviewer_name: string;
  comment: string;
  rating: number;
  created_at: string;
  tradesperson_id: number;
  tradespeople?: { business_name: string };
};

/* ────────────────────────────────────────────
   TIER + STATUS COLOURS
   ──────────────────────────────────────────── */
const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  featured: { bg: "#fef3c7", color: "#92400e" },
  premium: { bg: "#dbeafe", color: "#1e40af" },
  free: { bg: "#f1f5f9", color: "#475569" },
};

const STATUS_COLORS = {
  approved: { bg: "#dcfce7", color: "#166534" },
  pending: { bg: "#fef3c7", color: "#92400e" },
  rejected: { bg: "#fee2e2", color: "#991b1b" },
};

/* ────────────────────────────────────────────
   METRIC CARD
   ──────────────────────────────────────────── */
function MetricCard({ label, value, change, changeType, sparkData, sparkColor }: {
  label: string; value: string | number; change?: string; changeType?: "up" | "down" | "neutral";
  sparkData?: number[]; sparkColor?: string;
}) {
  const maxSpark = Math.max(...(sparkData ?? [1]));
  return (
    <div style={{
      background: "white", border: "1px solid #e2e8f0", borderRadius: "12px",
      padding: "18px 20px", flex: 1, minWidth: "150px",
    }}>
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px", fontWeight: "500" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ fontSize: "26px", fontWeight: "700", color: "#0f172a" }}>{value}</div>
        {change && (
          <span style={{
            fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "6px",
            background: changeType === "up" ? "#f0fdf4" : changeType === "down" ? "#fef2f2" : "#f8fafc",
            color: changeType === "up" ? "#166534" : changeType === "down" ? "#991b1b" : "#64748b",
          }}>{change}</span>
        )}
      </div>
      {sparkData && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "24px", marginTop: "10px" }}>
          {sparkData.map((v, i) => (
            <span key={i} style={{
              display: "block", flex: 1, borderRadius: "2px", minHeight: "3px",
              height: `${(v / maxSpark) * 100}%`,
              background: sparkColor ?? "#2563eb",
              opacity: i === sparkData.length - 1 ? 1 : 0.5,
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN DASHBOARD
   ──────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState({ total: 0, pending: 0, subscribers: 0, totalReviews: 0, featured: 0, premium: 0, free: 0 });
  const [listings, setListings] = useState<Tradesperson[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recentSubs, setRecentSubs] = useState<any[]>([]);

  // Table controls
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Action loading states
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  /* ──── FETCH ALL DATA ──── */
  const fetchAll = useCallback(async () => {
    const listingsRes = await supabase
      .from("tradespeople")
      .select("id, business_name, email, main_phone, mobile_phone, membership_tier, approved, created_at, logo_url, description")
      .order("created_at", { ascending: false });

    if (listingsRes.error) {
      console.error("Dashboard: listings fetch error", listingsRes.error);
    }

    const reviewsRes = await supabase
      .from("reviews")
      .select("id, reviewer_name, comment, rating, created_at, tradesperson_id, tradespeople(business_name)")
      .order("created_at", { ascending: false })
      .limit(20);

    if (reviewsRes.error) {
      console.error("Dashboard: reviews fetch error", reviewsRes.error);
    }

    const subsRes = await supabase
      .from("newsletter_subscribers")
      .select("id, email, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    const countRes = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true });

    const allListings = listingsRes.data;
    const allReviews = reviewsRes.data;
    const subs = subsRes.data;
    const subscriberCount = countRes.count;

    const list = allListings ?? [];
    console.log("Dashboard: fetched", list.length, "listings", list.slice(0, 2));
    setListings(list);
    setReviews(allReviews ?? []);
    setRecentSubs(subs ?? []);

    const isApproved = (t: any) => t.approved === true || t.approved === "true";
    const isNotApproved = (t: any) => !isApproved(t);

    setStats({
      total: list.filter(isApproved).length,
      pending: list.filter(isNotApproved).length,
      subscribers: subscriberCount ?? 0,
      totalReviews: (allReviews ?? []).length,
      featured: list.filter((t) => t.membership_tier === "featured" && isApproved(t)).length,
      premium: list.filter((t) => t.membership_tier === "premium" && isApproved(t)).length,
      free: list.filter((t) => t.membership_tier === "free" && isApproved(t)).length,
    });

    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ──── ACTIONS (all write to Supabase via API route) ──── */
  async function approveListing(id: number) {
    setActionLoading((s) => ({ ...s, [`approve-${id}`]: true }));
    const res = await fetch("/api/admin/update-listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates: { approved: true } }),
    });
    setActionLoading((s) => ({ ...s, [`approve-${id}`]: false }));
    if (res.ok) await fetchAll();
  }

  async function unapproveListingAction(id: number) {
    setActionLoading((s) => ({ ...s, [`unapprove-${id}`]: true }));
    const res = await fetch("/api/admin/update-listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates: { approved: false } }),
    });
    setActionLoading((s) => ({ ...s, [`unapprove-${id}`]: false }));
    if (res.ok) await fetchAll();
  }

  async function deleteListing(id: number) {
    if (!confirm("Permanently delete this listing? This cannot be undone.")) return;
    setActionLoading((s) => ({ ...s, [`delete-${id}`]: true }));
    const res = await fetch("/api/admin/update-listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" }),
    });
    setActionLoading((s) => ({ ...s, [`delete-${id}`]: false }));
    if (res.ok) await fetchAll();
  }

  async function changeTier(id: number, tier: string) {
    setActionLoading((s) => ({ ...s, [`tier-${id}`]: true }));
    const isFeatured = tier === "featured";
    const res = await fetch("/api/admin/update-listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates: { membership_tier: tier, is_featured: isFeatured } }),
    });
    setActionLoading((s) => ({ ...s, [`tier-${id}`]: false }));
    if (res.ok) await fetchAll();
  }

  async function deleteReview(id: number) {
    if (!confirm("Delete this review?")) return;
    setActionLoading((s) => ({ ...s, [`review-delete-${id}`]: true }));
    await supabase.from("reviews").delete().eq("id", id);
    setActionLoading((s) => ({ ...s, [`review-delete-${id}`]: false }));
    await fetchAll();
  }

  /* ──── FILTER + PAGINATE LISTINGS ──── */
  const filtered = listings.filter((t) => {
    const matchTab =
      activeTab === "all" ? true :
      activeTab === "pending" ? !t.approved :
      activeTab === "featured" ? t.membership_tier === "featured" :
      activeTab === "premium" ? t.membership_tier === "premium" :
      activeTab === "free" ? t.membership_tier === "free" : true;
    const matchSearch = !searchQuery.trim() || [t.business_name, t.email, t.main_phone, t.mobile_phone]
      .filter(Boolean).some((s) => s!.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTab && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  /* ──── REVENUE CALC ──── */
  const monthlyRevenue =
    stats.featured * 75 + stats.premium * 40;
  const featuredRevenue = stats.featured * 75;
  const premiumRevenue = stats.premium * 40;

  /* ──── ACTIVITY FEED (merge recent listings + reviews) ──── */
  const activityItems = [
    ...listings.slice(0, 8).map((t) => ({
      type: t.approved ? "approved" as const : "signup" as const,
      text: t.approved
        ? `${t.business_name} is live (${t.membership_tier})`
        : `${t.business_name} signed up as ${t.membership_tier}`,
      time: t.created_at,
      color: t.approved ? "#22c55e" : "#f59e0b",
    })),
    ...reviews.slice(0, 5).map((r) => ({
      type: "review" as const,
      text: `${r.reviewer_name} left a ${r.rating}-star review${r.tradespeople ? ` for ${(r.tradespeople as any).business_name}` : ""}`,
      time: r.created_at,
      color: "#3b82f6",
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  /* ──── BUTTON STYLE HELPERS ──── */
  const btnStyle = (variant: "default" | "success" | "warning" | "danger" | "primary"): React.CSSProperties => {
    const styles: Record<string, React.CSSProperties> = {
      default: { background: "white", border: "1px solid #e2e8f0", color: "#374151" },
      success: { background: "#dcfce7", border: "1px solid #86efac", color: "#166534" },
      warning: { background: "#fef9c3", border: "1px solid #fde68a", color: "#92400e" },
      danger: { background: "#fee2e2", border: "1px solid #fecaca", color: "#991b1b" },
      primary: { background: "#2563eb", border: "1px solid #2563eb", color: "white" },
    };
    return {
      ...styles[variant],
      fontSize: "11px", fontWeight: "600", padding: "5px 10px",
      borderRadius: "6px", cursor: "pointer", whiteSpace: "nowrap",
      transition: "opacity 0.15s",
    };
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px", fontSize: "13px", fontWeight: active ? "600" : "400",
    borderRadius: "6px", border: "none", cursor: "pointer",
    background: active ? "#eff6ff" : "transparent",
    color: active ? "#2563eb" : "#64748b",
    transition: "all 0.15s",
  });

  /* ──── LOADING STATE ──── */
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <div style={{ fontSize: "14px", color: "#94a3b8" }}>Loading dashboard...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  /* ──── RENDER ──── */
  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "14px", color: "#64748b", fontWeight: "400", margin: 0 }}>
          Welcome back. Here is what needs your attention.
        </h2>
      </div>

      {/* ──── METRIC CARDS ──── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        <MetricCard
          label="Live listings"
          value={stats.total}
          change={stats.pending > 0 ? `${stats.pending} pending` : "All clear"}
          changeType={stats.pending > 0 ? "down" : "up"}
          sparkData={[3, 5, 4, 6, 5, 8, stats.total]}
          sparkColor="#22c55e"
        />
        <MetricCard
          label="Pending approval"
          value={stats.pending}
          change={stats.pending > 0 ? "Needs action" : "None"}
          changeType={stats.pending > 0 ? "down" : "up"}
          sparkData={[2, 3, 1, 1, 4, 3, stats.pending]}
          sparkColor={stats.pending > 0 ? "#ef4444" : "#22c55e"}
        />
        <MetricCard
          label="Paid members"
          value={stats.featured + stats.premium}
          change={`${stats.featured}F / ${stats.premium}P`}
          changeType="neutral"
          sparkData={[2, 3, 3, 4, 5, 5, stats.featured + stats.premium]}
          sparkColor="#3b82f6"
        />
        <MetricCard
          label="Monthly revenue"
          value={`\u00A3${monthlyRevenue.toLocaleString()}`}
          change={`\u00A3${(monthlyRevenue * 12).toLocaleString()}/yr`}
          changeType="up"
          sparkData={[200, 280, 320, 380, 420, 500, monthlyRevenue]}
          sparkColor="#f59e0b"
        />
      </div>

      {/* ──── MAIN GRID: TABLE + SIDEBAR ──── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", marginBottom: "28px" }}>

        {/* ──── DATA TABLE CARD ──── */}
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
              {[
                { key: "all", label: `All (${listings.length})` },
                { key: "pending", label: `Pending (${stats.pending})` },
                { key: "featured", label: `Featured (${stats.featured})` },
                { key: "premium", label: `Premium (${stats.premium})` },
                { key: "free", label: `Free (${stats.free})` },
              ].map((tab) => (
                <button key={tab.key} onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }} style={tabStyle(activeTab === tab.key)}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search..."
                style={{
                  padding: "7px 12px", fontSize: "13px", border: "1px solid #e2e8f0",
                  borderRadius: "8px", outline: "none", width: "180px", background: "#f8fafc",
                }}
              />
              <button onClick={() => router.push("/admin/listings")} style={btnStyle("primary")}>
                + New listing
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Business", "Tier", "Status", "Phone", "Joined", "Actions"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#64748b", fontWeight: "500", fontSize: "12px", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No listings found</td></tr>
                ) : paginated.map((t) => {
                  const tc = TIER_COLORS[t.membership_tier] ?? TIER_COLORS.free;
                  const sc = t.approved ? STATUS_COLORS.approved : STATUS_COLORS.pending;
                  return (
                    <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {t.logo_url ? (
                            <img src={t.logo_url} alt="" style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover", border: "1px solid #e2e8f0" }} />
                          ) : (
                            <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", color: "#94a3b8" }}>
                              {t.business_name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: "600", color: "#0f172a", lineHeight: "1.3" }}>{t.business_name}</div>
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>{t.email || ""}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <select
                          value={t.membership_tier}
                          onChange={(e) => changeTier(t.id, e.target.value)}
                          disabled={!!actionLoading[`tier-${t.id}`]}
                          style={{
                            fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "999px",
                            background: tc.bg, color: tc.color, border: `1px solid ${tc.bg}`,
                            cursor: "pointer", appearance: "none", WebkitAppearance: "none",
                            paddingRight: "20px",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 6px center",
                          }}
                        >
                          <option value="free">Free</option>
                          <option value="premium">Premium</option>
                          <option value="featured">Featured</option>
                        </select>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          fontSize: "11px", fontWeight: "600", padding: "3px 10px",
                          borderRadius: "999px", background: sc.bg, color: sc.color,
                        }}>
                          {t.approved ? "Live" : "Pending"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#475569", fontSize: "12px" }}>{t.main_phone || "\u2014"}</td>
                      <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "12px", whiteSpace: "nowrap" }}>
                        {new Date(t.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button onClick={() => router.push(`/admin/listings/${t.id}`)} style={btnStyle("default")}>Edit</button>
                          {t.approved ? (
                            <button
                              onClick={() => unapproveListingAction(t.id)}
                              disabled={!!actionLoading[`unapprove-${t.id}`]}
                              style={{ ...btnStyle("warning"), opacity: actionLoading[`unapprove-${t.id}`] ? 0.5 : 1 }}
                            >
                              {actionLoading[`unapprove-${t.id}`] ? "..." : "Unpublish"}
                            </button>
                          ) : (
                            <button
                              onClick={() => approveListing(t.id)}
                              disabled={!!actionLoading[`approve-${t.id}`]}
                              style={{ ...btnStyle("success"), opacity: actionLoading[`approve-${t.id}`] ? 0.5 : 1 }}
                            >
                              {actionLoading[`approve-${t.id}`] ? "..." : "Approve"}
                            </button>
                          )}
                          <button
                            onClick={() => deleteListing(t.id)}
                            disabled={!!actionLoading[`delete-${t.id}`]}
                            style={{ ...btnStyle("danger"), opacity: actionLoading[`delete-${t.id}`] ? 0.5 : 1 }}
                          >
                            {actionLoading[`delete-${t.id}`] ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: "1px solid #f1f5f9", fontSize: "12px", color: "#94a3b8" }}>
            <span>Showing {filtered.length === 0 ? 0 : ((safeCurrentPage - 1) * pageSize) + 1}-{Math.min(safeCurrentPage * pageSize, filtered.length)} of {filtered.length}</span>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                style={{ ...btnStyle("default"), opacity: safeCurrentPage <= 1 ? 0.4 : 1 }}
              >Prev</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1;
                return (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    style={page === safeCurrentPage ? btnStyle("primary") : btnStyle("default")}
                  >{page}</button>
                );
              })}
              {totalPages > 5 && <span style={{ padding: "5px 4px" }}>...</span>}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                style={{ ...btnStyle("default"), opacity: safeCurrentPage >= totalPages ? 0.4 : 1 }}
              >Next</button>
            </div>
          </div>
        </div>

        {/* ──── RIGHT SIDEBAR ──── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Activity Feed */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: "0 0 14px" }}>Recent activity</h3>
            {activityItems.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#94a3b8" }}>No recent activity.</p>
            ) : activityItems.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: i < activityItems.length - 1 ? "1px solid #f8fafc" : "none" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color, marginTop: "5px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "12px", color: "#0f172a", lineHeight: "1.5" }}>{item.text}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>{timeAgo(item.time)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Breakdown */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: "0 0 4px" }}>Revenue by tier</h3>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "14px" }}>
              {"\u00A3"}{monthlyRevenue.toLocaleString()}<span style={{ fontSize: "13px", fontWeight: "400", color: "#94a3b8" }}>/mo</span>
            </div>
            {[
              { label: "Featured", count: stats.featured, amount: featuredRevenue, color: "#f59e0b", rate: 75 },
              { label: "Premium", count: stats.premium, amount: premiumRevenue, color: "#3b82f6", rate: 40 },
              { label: "Free", count: stats.free, amount: 0, color: "#cbd5e1", rate: 0 },
            ].map((tier) => (
              <div key={tier.label} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ color: "#475569" }}>{tier.label} <span style={{ color: "#94a3b8" }}>({tier.count} x {"\u00A3"}{tier.rate})</span></span>
                  <span style={{ fontWeight: "600", color: "#0f172a" }}>{"\u00A3"}{tier.amount.toLocaleString()}</span>
                </div>
                <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "3px", background: tier.color,
                    width: monthlyRevenue > 0 ? `${(tier.amount / monthlyRevenue) * 100}%` : "0%",
                    transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: "#64748b" }}>Projected annual</span>
              <span style={{ fontWeight: "700", color: "#0f172a" }}>{"\u00A3"}{(monthlyRevenue * 12).toLocaleString()}</span>
            </div>
          </div>

          {/* Recent Reviews */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
                Recent reviews <span style={{ fontSize: "12px", fontWeight: "400", color: "#94a3b8" }}>({stats.totalReviews})</span>
              </h3>
              <button onClick={() => router.push("/admin/reviews")} style={{ fontSize: "12px", color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: "500" }}>View all</button>
            </div>
            {reviews.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>No reviews yet.</p>
            ) : reviews.slice(0, 4).map((r) => (
              <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a" }}>{r.reviewer_name}</span>
                  <span style={{ fontSize: "12px", color: "#f59e0b" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                {r.tradespeople && (
                  <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "3px" }}>for {(r.tradespeople as any).business_name}</div>
                )}
                <p style={{ fontSize: "12px", color: "#475569", margin: "0 0 6px", lineHeight: "1.4" }}>
                  {r.comment?.substring(0, 100)}{(r.comment?.length ?? 0) > 100 ? "..." : ""}
                </p>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => deleteReview(r.id)}
                    disabled={!!actionLoading[`review-delete-${r.id}`]}
                    style={{ ...btnStyle("danger"), opacity: actionLoading[`review-delete-${r.id}`] ? 0.5 : 1 }}
                  >
                    {actionLoading[`review-delete-${r.id}`] ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Subscribers */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
                Newsletter <span style={{ fontSize: "12px", fontWeight: "400", color: "#94a3b8" }}>({stats.subscribers})</span>
              </h3>
              <button onClick={() => router.push("/admin/subscribers")} style={{ fontSize: "12px", color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: "500" }}>View all</button>
            </div>
            {recentSubs.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>No subscribers yet.</p>
            ) : recentSubs.slice(0, 5).map((s: any, i: number) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < Math.min(recentSubs.length, 5) - 1 ? "1px solid #f8fafc" : "none", fontSize: "12px" }}>
                <span style={{ color: "#0f172a" }}>{s.email}</span>
                <span style={{ color: "#94a3b8", whiteSpace: "nowrap", marginLeft: "8px" }}>
                  {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
