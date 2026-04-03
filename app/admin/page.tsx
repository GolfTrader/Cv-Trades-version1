"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function StatCard({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px 24px", flex: 1, minWidth: "160px" }}>
      <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "28px", fontWeight: "700", color: accent ? "#ef4444" : "#0f172a" }}>{value}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, pending: 0, subscribers: 0, reviews: 0 });
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [recentSubs, setRecentSubs] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const [
        { count: total },
        { count: pending },
        { count: subscribers },
        { count: reviews },
        { data: pListings },
        { data: subs },
        { data: pReviews },
      ] = await Promise.all([
        supabase.from("tradespeople").select("*", { count: "exact", head: true }).eq("approved", true),
        supabase.from("tradespeople").select("*", { count: "exact", head: true }).eq("approved", false),
        supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("approved", false),
        supabase.from("tradespeople").select("id, business_name, membership_tier, created_at").eq("approved", false).order("created_at", { ascending: false }).limit(10),
        supabase.from("newsletter_subscribers").select("email, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("reviews").select("id, reviewer_name, comment, rating, created_at").eq("approved", false).order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({ total: total ?? 0, pending: pending ?? 0, subscribers: subscribers ?? 0, reviews: reviews ?? 0 });
      setPendingListings(pListings ?? []);
      setRecentSubs(subs ?? []);
      setPendingReviews(pReviews ?? []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const TIER_COLORS: Record<string, { bg: string; color: string }> = {
    featured: { bg: "#fef3c7", color: "#92400e" },
    premium: { bg: "#dbeafe", color: "#1e40af" },
    free: { bg: "#f1f5f9", color: "#475569" },
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
      <div style={{ fontSize: "14px", color: "#94a3b8" }}>Loading dashboard...</div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Dashboard</h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>Welcome back. Here is what needs your attention.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
        <StatCard label="Live listings" value={stats.total} />
        <StatCard label="Pending approval" value={stats.pending} accent={stats.pending > 0} />
        <StatCard label="Newsletter subscribers" value={stats.subscribers} />
        <StatCard label="Reviews pending" value={stats.reviews} accent={stats.reviews > 0} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>

        {/* Pending listings */}
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Pending Listings</h2>
            <button onClick={() => router.push("/admin/pending")} style={{ fontSize: "12px", color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>View all</button>
          </div>
          {pendingListings.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#94a3b8", padding: "16px 0", margin: 0 }}>No pending listings.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {["Business", "Tier", "Action"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 0", color: "#94a3b8", fontWeight: "500", fontSize: "11px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendingListings.map((t: any) => {
                  const ts = TIER_COLORS[t.membership_tier] ?? TIER_COLORS.free;
                  return (
                    <tr key={t.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td style={{ padding: "8px 0", color: "#0f172a", fontWeight: "500" }}>{t.business_name}</td>
                      <td style={{ padding: "8px 0" }}>
                        <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "999px", background: ts.bg, color: ts.color, fontWeight: "600" }}>{t.membership_tier}</span>
                      </td>
                      <td style={{ padding: "8px 0" }}>
                        <button onClick={() => router.push(`/admin/listings/${t.id}`)} style={{ fontSize: "11px", color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>Review</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pending reviews */}
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Pending Reviews</h2>
            <button onClick={() => router.push("/admin/reviews")} style={{ fontSize: "12px", color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>View all</button>
          </div>
          {pendingReviews.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#94a3b8", padding: "16px 0", margin: 0 }}>No pending reviews.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {pendingReviews.map((r: any) => (
                <div key={r.id} style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a" }}>{r.reviewer_name}</span>
                    <span style={{ fontSize: "12px", color: "#f59e0b" }}>{"★".repeat(r.rating)}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 4px" }}>{r.comment?.substring(0, 80)}{(r.comment?.length ?? 0) > 80 ? "..." : ""}</p>
                  <button onClick={() => router.push("/admin/reviews")} style={{ fontSize: "11px", color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Review</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent newsletter signups */}
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Recent Newsletter Signups</h2>
          <button onClick={() => router.push("/admin/subscribers")} style={{ fontSize: "12px", color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>View all</button>
        </div>
        {recentSubs.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>No subscribers yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ textAlign: "left", padding: "6px 0", color: "#94a3b8", fontWeight: "500", fontSize: "11px" }}>Email</th>
                <th style={{ textAlign: "right", padding: "6px 0", color: "#94a3b8", fontWeight: "500", fontSize: "11px" }}>Signed up</th>
              </tr>
            </thead>
            <tbody>
              {recentSubs.map((s: any, i: number) => (
                <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "8px 0", color: "#0f172a" }}>{s.email}</td>
                  <td style={{ padding: "8px 0", color: "#94a3b8", textAlign: "right" }}>
                    {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
