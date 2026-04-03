"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
  }

  const filtered = subscribers.filter((s) => s.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Newsletter Subscribers</h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>{subscribers.length} total subscribers</p>
        </div>
        <button onClick={exportCSV} style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "500", border: "1px solid #e2e8f0", borderRadius: "7px", background: "white", cursor: "pointer", color: "#374151" }}>
          Export CSV
        </button>
      </div>

      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search email..." style={{ width: "280px", padding: "8px 10px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "6px", outline: "none", marginBottom: "16px", display: "block" }} />

      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ textAlign: "left", padding: "10px 16px", color: "#64748b", fontWeight: "600", fontSize: "12px" }}>Email</th>
              <th style={{ textAlign: "left", padding: "10px 16px", color: "#64748b", fontWeight: "600", fontSize: "12px" }}>Signed up</th>
              <th style={{ textAlign: "left", padding: "10px 16px", color: "#64748b", fontWeight: "600", fontSize: "12px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={3} style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>No subscribers found</td></tr>
            ) : filtered.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px 16px", color: "#0f172a" }}>{s.email}</td>
                <td style={{ padding: "10px 16px", color: "#94a3b8" }}>
                  {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <button onClick={() => deleteSub(s.id, s.email)} style={{ fontSize: "11px", padding: "3px 8px", border: "1px solid #fecaca", borderRadius: "4px", background: "#fee2e2", cursor: "pointer", color: "#991b1b" }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
