"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

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
    setActionLoading((s) => ({ ...s, [`a-${id}`]: true }));
    await supabase.from("reviews").update({ approved: true }).eq("id", id);
    setActionLoading((s) => ({ ...s, [`a-${id}`]: false }));
    fetchReviews();
  }

  async function unapprove(id: number) {
    setActionLoading((s) => ({ ...s, [`u-${id}`]: true }));
    await supabase.from("reviews").update({ approved: false }).eq("id", id);
    setActionLoading((s) => ({ ...s, [`u-${id}`]: false }));
    fetchReviews();
  }

  async function deleteReview(id: number) {
    if (!confirm("Delete this review permanently?")) return;
    setActionLoading((s) => ({ ...s, [`d-${id}`]: true }));
    await supabase.from("reviews").delete().eq("id", id);
    setActionLoading((s) => ({ ...s, [`d-${id}`]: false }));
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
    const a = document.createElement("a"); a.href = url; a.download = "reviews.csv"; a.click();
  }

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;
  const approvedCount = reviews.filter((r) => r.approved).length;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px", fontSize: "13px", fontWeight: active ? "600" : "400",
    borderRadius: "6px", border: "none", cursor: "pointer",
    background: active ? "#eff6ff" : "transparent",
    color: active ? "#2563eb" : "#64748b",
  });

  const btnStyle = (variant: "success" | "warning" | "danger" | "default"): React.CSSProperties => {
    const map: Record<string, React.CSSProperties> = {
      success: { background: "#dcfce7", border: "1px solid #86efac", color: "#166534" },
      warning: { background: "#fef9c3", border: "1px solid #fde68a", color: "#92400e" },
      danger: { background: "#fee2e2", border: "1px solid #fecaca", color: "#991b1b" },
      default: { background: "white", border: "1px solid #e2e8f0", color: "#374151" },
    };
    return { ...map[variant], fontSize: "11px", fontWeight: "600", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", whiteSpace: "nowrap" };
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <div style={{ fontSize: "14px", color: "#94a3b8" }}>Loading reviews...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          {reviews.length} total reviews, {pendingCount} pending approval
        </p>
        <button onClick={exportCSV} style={{ ...btnStyle("default"), fontSize: "13px", padding: "8px 16px" }}>Export CSV</button>
      </div>

      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", gap: "2px" }}>
            <button onClick={() => setFilter("pending")} style={tabStyle(filter === "pending")}>Pending ({pendingCount})</button>
            <button onClick={() => setFilter("approved")} style={tabStyle(filter === "approved")}>Approved ({approvedCount})</button>
            <button onClick={() => setFilter("all")} style={tabStyle(filter === "all")}>All ({reviews.length})</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
            No {filter === "all" ? "" : filter} reviews found.
          </div>
        ) : (
          <div>
            {filtered.map((r, i) => (
              <div key={r.id} style={{ padding: "16px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{r.reviewer_name}</span>
                      <span style={{ fontSize: "13px", color: "#f59e0b", letterSpacing: "1px" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                      <span style={{
                        fontSize: "11px", padding: "2px 8px", borderRadius: "999px", fontWeight: "600",
                        background: r.approved ? "#dcfce7" : "#fef3c7",
                        color: r.approved ? "#166534" : "#92400e",
                      }}>
                        {r.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 6px" }}>
                      For: <span style={{ color: "#475569", fontWeight: "500" }}>{r.tradespeople?.business_name ?? "Unknown"}</span>
                      {" "}&middot;{" "}
                      {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {r.comment && (
                      <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: "1.6" }}>{r.comment}</p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                    {!r.approved ? (
                      <button onClick={() => approve(r.id)} disabled={!!actionLoading[`a-${r.id}`]}
                        style={{ ...btnStyle("success"), opacity: actionLoading[`a-${r.id}`] ? 0.5 : 1 }}>
                        {actionLoading[`a-${r.id}`] ? "..." : "Approve"}
                      </button>
                    ) : (
                      <button onClick={() => unapprove(r.id)} disabled={!!actionLoading[`u-${r.id}`]}
                        style={{ ...btnStyle("warning"), opacity: actionLoading[`u-${r.id}`] ? 0.5 : 1 }}>
                        {actionLoading[`u-${r.id}`] ? "..." : "Unpublish"}
                      </button>
                    )}
                    <button onClick={() => deleteReview(r.id)} disabled={!!actionLoading[`d-${r.id}`]}
                      style={{ ...btnStyle("danger"), opacity: actionLoading[`d-${r.id}`] ? 0.5 : 1 }}>
                      {actionLoading[`d-${r.id}`] ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
