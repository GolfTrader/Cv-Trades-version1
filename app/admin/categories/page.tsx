"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CategoriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const { data } = await supabase.from("categories").select("id, name").order("name");
    setItems(data ?? []);
    setLoading(false);
  }

  async function addItem() {
    if (!newName.trim()) return;
    setSaving(true);
    await supabase.from("categories").insert({ name: newName.trim() });
    setNewName("");
    setSaving(false);
    fetchItems();
  }

  async function deleteItem(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This will remove it from all listings.`)) return;
    await supabase.from("categories").delete().eq("id", id);
    fetchItems();
  }

  async function saveRename(id: number) {
    if (!editingName.trim()) return;
    await supabase.from("categories").update({ name: editingName.trim() }).eq("id", id);
    setEditingId(null);
    setEditingName("");
    fetchItems();
  }

  function exportCSV() {
    const csv = ["id,name", ...items.map((i) => `${i.id},${JSON.stringify(i.name)}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "categories.csv"; a.click();
  }

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
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>{items.length} categories</p>
        <button onClick={exportCSV} style={{ ...btnStyle("default"), fontSize: "13px", padding: "8px 16px" }}>Export CSV</button>
      </div>

      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", maxWidth: "640px" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "8px" }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Add new category..."
            style={{ flex: 1, padding: "8px 12px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", background: "#f8fafc" }}
          />
          <button onClick={addItem} disabled={saving || !newName.trim()} style={{ ...btnStyle("primary"), fontSize: "13px", padding: "8px 16px", opacity: !newName.trim() ? 0.5 : 1 }}>
            + Add
          </button>
        </div>

        {items.map((item, i) => (
          <div key={item.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 18px",
            borderBottom: i < items.length - 1 ? "1px solid #f1f5f9" : "none",
            transition: "background 0.1s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {editingId === item.id ? (
              <div style={{ display: "flex", gap: "8px", flex: 1 }}>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveRename(item.id); if (e.key === "Escape") setEditingId(null); }}
                  autoFocus
                  style={{ flex: 1, padding: "5px 10px", fontSize: "13px", border: "1px solid #2563eb", borderRadius: "6px", outline: "none" }}
                />
                <button onClick={() => saveRename(item.id)} style={btnStyle("primary")}>Save</button>
                <button onClick={() => setEditingId(null)} style={btnStyle("default")}>Cancel</button>
              </div>
            ) : (
              <>
                <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: "500" }}>{item.name}</span>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => { setEditingId(item.id); setEditingName(item.name); }} style={btnStyle("default")}>Rename</button>
                  <button onClick={() => deleteItem(item.id, item.name)} style={btnStyle("danger")}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>No categories yet. Add one above.</div>
        )}
      </div>
    </div>
  );
}
