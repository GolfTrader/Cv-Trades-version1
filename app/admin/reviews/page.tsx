"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  useEffect(() => { fetchReviews(); }, []);

  async function fetchReviews() {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*, tradespeople(business_name)")
      .order("created_at", { ascending: false });
    setReviews(data ?? []);
    setLoading(false);
  }

  async function approve(id: number) {
    await supabase.from("reviews").update({ approved: true }).eq("id", id);
    fetchReviews();
  }

  async function reject(id: number) {
    if (!confirm("Delete this review permanently?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    fetchReviews();
  }

  function exportCSV() {
    const data = filtered;
    if (!data.length) return;
    const headers = ["id", "reviewer_name", "rating", "comment", "approved", "created_at", "business"];
    const rows = data.map((r) => [r.id, r.reviewer_name, r.rating, JSON.stringify(r.comment ?? ""), r.approved, r.created_at, r.tradespeople?.business_name].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reviews.csv";
    a.click();
  }

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Reviews</h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>{reviews.filter((r) => !r.approved).length} pending approval</p>
        </div>
        <button onClick={exportCSV} style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "500", border: "1px solid #e2e8f0", borderRadius: "7px", background: "white", cursor: "pointer", color: "#374151" }}>
          Export CSV
        </button>
      </div>

      <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
        {(["pending", "approved", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 14px", fontSize: "13px", fontWeight: "500", border: `1px solid ${filter === f ? "#2563eb" : "#e2e8f0"}`, borderRadius: "7px", background: filter === f ? "#dbeafe" : "white", color: filter === f ? "#1e40af" : "#374151", cursor: "pointer" }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ fontSize: "13px", color: "#94a3b8" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>No {filter === "all" ? "" : filter} reviews.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((r) => (
            <div key={r.id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{r.reviewer_name}</span>
                    <span style={{ fontSize: "13px", color: "#f59e0b" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "999px", background: r.approved ? "#dcfce7" : "#fef3c7", color: r.approved ? "#166534" : "#92400e", fontWeight: "500" }}>
                      {r.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                    For: <strong style={{ color: "#475569" }}>{r.tradespeople?.business_name}</strong> · {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {!r.approved && (
                    <button onClick={() => approve(r.id)} style={{ fontSize: "12px", padding: "5px 12px", border: "1px solid #86efac", borderRadius: "6px", background: "#dcfce7", cursor: "pointer", color: "#166534", fontWeight: "500" }}>Approve</button>
                  )}
                  <button onClick={() => reject(r.id)} style={{ fontSize: "12px", padding: "5px 12px", border: "1px solid #fecaca", borderRadius: "6px", background: "#fee2e2", cursor: "pointer", color: "#991b1b", fontWeight: "500" }}>Delete</button>
                </div>
              </div>
              {r.comment && <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: "1.5" }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
