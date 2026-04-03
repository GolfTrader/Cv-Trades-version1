"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PendingPage() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPending(); }, []);

  async function fetchPending() {
    setLoading(true);
    const { data } = await supabase
      .from("tradespeople")
      .select("*, tradesperson_categories(categories(name)), tradesperson_areas(areas(name))")
      .eq("approved", false)
      .order("created_at", { ascending: false });
    setListings(data ?? []);
    setLoading(false);
  }

  async function approve(id: number) {
    await supabase.from("tradespeople").update({ approved: true }).eq("id", id);
    fetchPending();
  }

  async function reject(id: number, name: string) {
    if (!confirm(`Reject and delete "${name}" permanently?`)) return;
    await supabase.from("tradespeople").delete().eq("id", id);
    fetchPending();
  }

  const TIER_COLORS: Record<string, { bg: string; color: string }> = {
    featured: { bg: "#fef3c7", color: "#92400e" },
    premium: { bg: "#dbeafe", color: "#1e40af" },
    free: { bg: "#f1f5f9", color: "#475569" },
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Pending Approval</h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>{listings.length} listing{listings.length !== 1 ? "s" : ""} awaiting review</p>
      </div>

      {loading ? (
        <p style={{ fontSize: "13px", color: "#94a3b8" }}>Loading...</p>
      ) : listings.length === 0 ? (
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "60px", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>✓</div>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>All caught up</p>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>No listings pending approval.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {listings.map((t) => {
            const tierStyle = TIER_COLORS[t.membership_tier] ?? TIER_COLORS.free;
            const cats = t.tradesperson_categories?.map((c: any) => c.categories?.name).filter(Boolean).join(", ") || "No categories";
            const areas = t.tradesperson_areas?.map((a: any) => a.areas?.name).filter(Boolean).join(", ") || "No areas";
            return (
              <div key={t.id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>{t.business_name}</h3>
                      <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: tierStyle.bg, color: tierStyle.color, fontWeight: "600" }}>
                        {t.membership_tier}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "6px", marginBottom: "10px" }}>
                      {[
                        { label: "Contact", value: t.contact_name },
                        { label: "Email", value: t.email },
                        { label: "Phone", value: t.phone },
                        { label: "Town", value: t.town },
                        { label: "Categories", value: cats },
                        { label: "Areas", value: areas },
                      ].map(({ label, value }) => value ? (
                        <div key={label}>
                          <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>{label}</span>
                          <span style={{ fontSize: "13px", color: "#374151" }}>{value}</span>
                        </div>
                      ) : null)}
                    </div>
                    {t.description && <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>{t.description}</p>}
                    <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "8px", marginBottom: 0 }}>
                      Submitted {new Date(t.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginLeft: "20px", flexShrink: 0 }}>
                    <button onClick={() => approve(t.id)} style={{ padding: "8px 20px", fontSize: "13px", fontWeight: "600", border: "1px solid #86efac", borderRadius: "7px", background: "#dcfce7", cursor: "pointer", color: "#166534" }}>
                      Approve
                    </button>
                    <button onClick={() => router.push(`/admin/listings/${t.id}`)} style={{ padding: "8px 20px", fontSize: "13px", fontWeight: "500", border: "1px solid #e2e8f0", borderRadius: "7px", background: "white", cursor: "pointer", color: "#374151" }}>
                      Edit first
                    </button>
                    <button onClick={() => reject(t.id, t.business_name)} style={{ padding: "8px 20px", fontSize: "13px", fontWeight: "500", border: "1px solid #fecaca", borderRadius: "7px", background: "#fee2e2", cursor: "pointer", color: "#991b1b" }}>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
