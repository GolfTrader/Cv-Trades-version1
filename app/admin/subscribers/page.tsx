"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => { fetchSubs(); }, []);

  async function fetchSubs() {
    setLoading(true);
    const { data } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
    setSubscribers(data ?? []);
    setLoading(false);
  }

  async function deleteSub(id: number, email: string) {
    if (!confirm(`Remove ${email} from the newsletter?`)) return;
    await supabase.from("newsletter_subscribers").delete().eq("id", id);
    fetchSubs();
  }

  function exportCSV() {
    const csv = ["email,created_at", ...subscribers.map((s) => `${s.email},${s.created_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "newsletter-subscribers.csv"; a.click();
  }

  const filtered = subscribers.filter((s) => s.email?.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const btnStyle = (variant: "danger" | "default" | "primary"): React.CSSProperties => {
    const map: Record<string, React.CSSProperties> = {
      danger: { background: "#fee2e2", border: "1px solid #fecaca", color: "#991b1b" },
      default: { background: "white", border: "1px solid #e2e8f0", color: "#374151" },
      primary: { background: "#2563eb", border: "1px solid #2563eb", color: "white" },
    };
    return { ...map[variant], fontSize: "11px", fontWeight: "600", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", whiteSpace: "nowrap" };
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <div style={{ fontSize: "14px", color: "#94a3b8" }}>Loading...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>{subscribers.length} total subscribers</p>
        <button onClick={exportCSV} style={{ ...btnStyle("default"), fontSize: "13px", padding: "8px 16px" }}>Export CSV</button>
      </div>

      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9" }}>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by email..."
            style={{ width: "280px", padding: "8px 12px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", background: "#f8fafc" }}
          />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ textAlign: "left", padding: "10px 18px", color: "#64748b", fontWeight: "500", fontSize: "12px", borderBottom: "1px solid #e2e8f0" }}>Email</th>
              <th style={{ textAlign: "left", padding: "10px 18px", color: "#64748b", fontWeight: "500", fontSize: "12px", borderBottom: "1px solid #e2e8f0" }}>Signed up</th>
              <th style={{ textAlign: "right", padding: "10px 18px", color: "#64748b", fontWeight: "500", fontSize: "12px", borderBottom: "1px solid #e2e8f0" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={3} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No subscribers found</td></tr>
            ) : paginated.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "10px 18px", color: "#0f172a", fontWeight: "500" }}>{s.email}</td>
                <td style={{ padding: "10px 18px", color: "#94a3b8" }}>
                  {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td style={{ padding: "10px 18px", textAlign: "right" }}>
                  <button onClick={() => deleteSub(s.id, s.email)} style={btnStyle("danger")}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length > pageSize && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: "1px solid #f1f5f9", fontSize: "12px", color: "#94a3b8" }}>
            <span>Showing {((safePage - 1) * pageSize) + 1}-{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}</span>
            <div style={{ display: "flex", gap: "4px" }}>
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} style={{ ...btnStyle("default"), opacity: safePage <= 1 ? 0.4 : 1 }}>Prev</button>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} style={{ ...btnStyle("default"), opacity: safePage >= totalPages ? 0.4 : 1 }}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
