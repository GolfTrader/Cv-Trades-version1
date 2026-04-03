"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AreasPage() {
  const [items, setItems] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const { data } = await supabase.from("areas").select("id, name").order("name");
    setItems(data ?? []);
    setLoading(false);
  }

  async function addItem() {
    if (!newName.trim()) return;
    setSaving(true);
    await supabase.from("areas").insert({ name: newName.trim() });
    setNewName("");
    setSaving(false);
    fetchItems();
  }

  async function deleteItem(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This will remove it from all listings.`)) return;
    await supabase.from("areas").delete().eq("id", id);
    fetchItems();
  }

  async function renameItem(id: number, oldName: string) {
    const newVal = prompt("Rename to:", oldName);
    if (!newVal || newVal === oldName) return;
    await supabase.from("areas").update({ name: newVal }).eq("id", id);
    fetchItems();
  }

  function exportCSV() {
    const csv = ["id,name", ...items.map((i) => `${i.id},${JSON.stringify(i.name)}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "areas.csv";
    a.click();
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Areas</h1>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>Manage areas covered by the directory</p>
      </div>
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", maxWidth: "600px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", color: "#94a3b8" }}>{items.length} areas</p>
          <button onClick={exportCSV} style={{ fontSize: "12px", padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: "6px", background: "white", cursor: "pointer", color: "#374151" }}>Export CSV</button>
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()} placeholder="Add new area..." style={{ flex: 1, padding: "8px 10px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "6px", outline: "none" }} />
          <button onClick={addItem} disabled={saving || !newName.trim()} style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "600", border: "none", borderRadius: "6px", background: "#2563eb", color: "white", cursor: "pointer" }}>Add</button>
        </div>
        {loading ? <p style={{ fontSize: "13px", color: "#94a3b8" }}>Loading...</p> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: "6px", background: "#f8fafc" }}>
                <span style={{ fontSize: "13px", color: "#0f172a" }}>{item.name}</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => renameItem(item.id, item.name)} style={{ fontSize: "11px", padding: "3px 8px", border: "1px solid #e2e8f0", borderRadius: "4px", background: "white", cursor: "pointer", color: "#374151" }}>Rename</button>
                  <button onClick={() => deleteItem(item.id, item.name)} style={{ fontSize: "11px", padding: "3px 8px", border: "1px solid #fecaca", borderRadius: "4px", background: "#fee2e2", cursor: "pointer", color: "#991b1b" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
