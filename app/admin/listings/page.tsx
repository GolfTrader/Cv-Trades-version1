"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function exportCSV(data: any[]) {
  if (!data.length) return;
  const headers = ["id", "business_name", "membership_tier", "approved", "phone", "email", "website", "town", "created_at"];
  const rows = data.map((t) => headers.map((h) => JSON.stringify(t[h] ?? "")).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tradespeople.csv";
  a.click();
}

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  featured: { bg: "#fef3c7", color: "#92400e" },
  premium: { bg: "#dbeafe", color: "#1e40af" },
  free: { bg: "#f1f5f9", color: "#475569" },
};

const TRADE_BODIES = [
  "NICEIC", "Gas Safe", "NAPIT", "OFTEC", "CIPHE", "APHC", "FMB",
  "NHBC", "RIBA", "RICS", "TrustMark", "Which? Trusted Trader",
  "Checkatrade Approved", "CHAS", "Constructionline",
];

const emptyForm = {
  business_name: "", contact_name: "", phone: "", mobile: "",
  email: "", website: "", town: "", description: "",
  membership_tier: "free", billing_cycle: "monthly",
  approved: false, is_featured: false,
  whatsapp_url: "", instagram_url: "", facebook_url: "",
  twitter_url: "", linkedin_url: "", tiktok_url: "",
  trade_bodies: [] as string[],
  selectedCategories: [] as number[],
  selectedAreas: [] as number[],
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", fontSize: "13px",
  border: "1px solid #e2e8f0", borderRadius: "6px",
  outline: "none", boxSizing: "border-box", background: "white",
};
const labelStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: "500", color: "#374151",
  display: "block", marginBottom: "4px",
};
const sectionHeadStyle: React.CSSProperties = {
  fontSize: "11px", fontWeight: "700", color: "#64748b",
  textTransform: "uppercase", letterSpacing: "0.07em",
  borderBottom: "1px solid #f1f5f9", paddingBottom: "8px",
  marginBottom: "14px", marginTop: "8px",
};

export default function ListingsPage() {
  const router = useRouter();
  const [tradespeople, setTradespeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const { data } = await supabase
      .from("tradespeople")
      .select("*, tradesperson_categories(categories(name)), tradesperson_areas(areas(name))")
      .order("created_at", { ascending: false });
    setTradespeople(data ?? []);
    const { data: cats } = await supabase.from("categories").select("id, name").order("name");
    const { data: areasData } = await supabase.from("areas").select("id, name").order("name");
    setCategories(cats ?? []);
    setAreas(areasData ?? []);
    setLoading(false);
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function uploadLogo(tradespersonId: number): Promise<string> {
    if (!logoFile) return "";
    const ext = logoFile.name.split(".").pop();
    const path = `logos/${tradespersonId}.${ext}`;
    const { error } = await supabase.storage.from("logos").upload(path, logoFile, { upsert: true });
    if (error) return "";
    const { data } = supabase.storage.from("logos").getPublicUrl(path);
    return data.publicUrl;
  }

  async function approve(id: number) {
    await supabase.from("tradespeople").update({ approved: true }).eq("id", id);
    fetchAll();
  }

  async function unapprove(id: number) {
    await supabase.from("tradespeople").update({ approved: false }).eq("id", id);
    fetchAll();
  }

  async function deleteListing(id: number) {
    if (!confirm("Delete this listing permanently?")) return;
    await supabase.from("tradespeople").delete().eq("id", id);
    fetchAll();
  }

  async function createListing() {
    if (!form.business_name.trim()) return;
    setSaving(true);
    const slug = form.business_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { data: newTP, error } = await supabase.from("tradespeople").insert({
      business_name: form.business_name, contact_name: form.contact_name,
      phone: form.phone, mobile: form.mobile, email: form.email,
      website: form.website, town: form.town, description: form.description,
      membership_tier: form.membership_tier, billing_cycle: form.billing_cycle,
      approved: form.approved, is_featured: form.is_featured,
      whatsapp_url: form.whatsapp_url, instagram_url: form.instagram_url,
      facebook_url: form.facebook_url, twitter_url: form.twitter_url,
      linkedin_url: form.linkedin_url, tiktok_url: form.tiktok_url,
      trade_bodies: form.trade_bodies, slug,
    }).select().single();

    if (!error && newTP) {
      if (logoFile) {
        const logoUrl = await uploadLogo(newTP.id);
        if (logoUrl) await supabase.from("tradespeople").update({ logo_url: logoUrl }).eq("id", newTP.id);
      }
      if (form.selectedCategories.length > 0) {
        await supabase.from("tradesperson_categories").insert(
          form.selectedCategories.map((cat_id) => ({ tradesperson_id: newTP.id, category_id: cat_id }))
        );
      }
      if (form.selectedAreas.length > 0) {
        await supabase.from("tradesperson_areas").insert(
          form.selectedAreas.map((area_id) => ({ tradesperson_id: newTP.id, area_id }))
        );
      }
    }
    setSaving(false);
    setShowCreate(false);
    setForm({ ...emptyForm });
    setLogoFile(null);
    setLogoPreview("");
    fetchAll();
  }

  function toggleChip(list: number[], id: number) {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  function toggleTradeBody(name: string) {
    setForm((f) => ({
      ...f,
      trade_bodies: f.trade_bodies.includes(name)
        ? f.trade_bodies.filter((x) => x !== name)
        : [...f.trade_bodies, name],
    }));
  }

  const filtered = tradespeople.filter((t) => {
    const matchSearch = t.business_name?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === "all" || t.membership_tier === tierFilter;
    const matchStatus = statusFilter === "all" || (statusFilter === "approved" ? t.approved : !t.approved);
    return matchSearch && matchTier && matchStatus;
  });

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: "4px 10px", fontSize: "12px", fontWeight: "500", borderRadius: "999px",
    cursor: "pointer", border: `1px solid ${active ? "#2563eb" : "#e2e8f0"}`,
    background: active ? "#dbeafe" : "white", color: active ? "#1e40af" : "#374151",
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Tradespeople</h1>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>{tradespeople.length} total listings</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => exportCSV(filtered)} style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "500", border: "1px solid #e2e8f0", borderRadius: "7px", background: "white", cursor: "pointer", color: "#374151" }}>Export CSV</button>
          <button onClick={() => setShowCreate(true)} style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "600", border: "none", borderRadius: "7px", background: "#2563eb", cursor: "pointer", color: "white" }}>+ New listing</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email..." style={{ ...inputStyle, width: "240px" }} />
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} style={{ ...inputStyle, width: "140px" }}>
          <option value="all">All tiers</option>
          <option value="featured">Featured</option>
          <option value="premium">Premium</option>
          <option value="free">Free</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: "140px" }}>
          <option value="all">All statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Business", "Tier", "Categories", "Areas", "Status", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#64748b", fontWeight: "600", fontSize: "12px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>No listings found</td></tr>
            ) : filtered.map((t) => {
              const ts = TIER_COLORS[t.membership_tier] ?? TIER_COLORS.free;
              const cats = t.tradesperson_categories?.map((c: any) => c.categories?.name).filter(Boolean).join(", ") || "—";
              const areasArr = t.tradesperson_areas?.map((a: any) => a.areas?.name).filter(Boolean) ?? [];
              const areasStr = areasArr.slice(0, 2).join(", ") + (areasArr.length > 2 ? ` +${areasArr.length - 2}` : "") || "—";
              return (
                <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {t.logo_url && <img src={t.logo_url} alt="" style={{ width: "28px", height: "28px", borderRadius: "4px", objectFit: "cover" }} />}
                      <div>
                        <div style={{ fontWeight: "600", color: "#0f172a" }}>{t.business_name}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: ts.bg, color: ts.color, fontWeight: "600" }}>{t.membership_tier}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#475569", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cats}</td>
                  <td style={{ padding: "12px 16px", color: "#475569", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{areasStr}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", background: t.approved ? "#dcfce7" : "#fef3c7", color: t.approved ? "#166534" : "#92400e", fontWeight: "600" }}>
                      {t.approved ? "Live" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => router.push(`/admin/listings/${t.id}`)} style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "5px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#374151" }}>Edit</button>
                      {t.approved
                        ? <button onClick={() => unapprove(t.id)} style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "5px", border: "1px solid #fde68a", background: "#fef9c3", cursor: "pointer", color: "#92400e" }}>Unpublish</button>
                        : <button onClick={() => approve(t.id)} style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "5px", border: "1px solid #86efac", background: "#dcfce7", cursor: "pointer", color: "#166534" }}>Approve</button>
                      }
                      <button onClick={() => deleteListing(t.id)} style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "5px", border: "1px solid #fecaca", background: "#fee2e2", cursor: "pointer", color: "#991b1b" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, overflowY: "auto", padding: "40px 20px" }}>
          <div style={{ background: "white", borderRadius: "12px", width: "100%", maxWidth: "700px", margin: "0 auto 60px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>New Listing</h2>
              <button onClick={() => setShowCreate(false)} style={{ fontSize: "22px", border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}>×</button>
            </div>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>Fill in as much detail as possible. All fields can be edited later.</p>

            <div style={sectionHeadStyle}>Status &amp; Tier</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "14px", marginBottom: "20px", alignItems: "end" }}>
              <div>
                <label style={labelStyle}>Membership tier</label>
                <select value={form.membership_tier} onChange={(e) => setForm({ ...form, membership_tier: e.target.value })} style={inputStyle}>
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Billing cycle</label>
                <select value={form.billing_cycle} onChange={(e) => setForm({ ...form, billing_cycle: e.target.value })} style={inputStyle}>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "14px", paddingBottom: "2px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  <input type="checkbox" checked={form.approved} onChange={(e) => setForm({ ...form, approved: e.target.checked })} /> Approved
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured
                </label>
              </div>
            </div>

            <div style={sectionHeadStyle}>Business Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Business name *</label>
                <input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} style={inputStyle} />
              </div>
              {[
                { f: "contact_name", l: "Contact name" }, { f: "town", l: "Town" },
                { f: "phone", l: "Phone" }, { f: "mobile", l: "Mobile" },
                { f: "email", l: "Email" }, { f: "website", l: "Website" },
              ].map(({ f, l }) => (
                <div key={f}>
                  <label style={labelStyle}>{l}</label>
                  <input value={(form as any)[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} style={inputStyle} />
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>

            <div style={sectionHeadStyle}>Logo Upload</div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              {logoPreview && <img src={logoPreview} alt="" style={{ width: "56px", height: "56px", borderRadius: "8px", objectFit: "cover", border: "1px solid #e2e8f0" }} />}
              <div>
                <input type="file" accept="image/*" onChange={handleLogoChange} style={{ fontSize: "13px" }} />
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0" }}>PNG, JPG or WebP recommended</p>
              </div>
            </div>

            <div style={sectionHeadStyle}>Social &amp; Messaging</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              {[
                { f: "whatsapp_url", l: "WhatsApp" }, { f: "instagram_url", l: "Instagram" },
                { f: "facebook_url", l: "Facebook" }, { f: "twitter_url", l: "X / Twitter" },
                { f: "linkedin_url", l: "LinkedIn" }, { f: "tiktok_url", l: "TikTok" },
              ].map(({ f, l }) => (
                <div key={f}>
                  <label style={labelStyle}>{l}</label>
                  <input value={(form as any)[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} style={inputStyle} placeholder="https://..." />
                </div>
              ))}
            </div>

            <div style={sectionHeadStyle}>Trade Body Accreditations</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              {TRADE_BODIES.map((name) => (
                <button key={name} type="button" onClick={() => toggleTradeBody(name)} style={chipStyle(form.trade_bodies.includes(name))}>{name}</button>
              ))}
            </div>

            <div style={sectionHeadStyle}>Categories</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              {categories.map((c) => (
                <button key={c.id} type="button" onClick={() => setForm({ ...form, selectedCategories: toggleChip(form.selectedCategories, c.id) })} style={chipStyle(form.selectedCategories.includes(c.id))}>{c.name}</button>
              ))}
            </div>

            <div style={sectionHeadStyle}>Areas Covered</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
              {areas.map((a) => (
                <button key={a.id} type="button" onClick={() => setForm({ ...form, selectedAreas: toggleChip(form.selectedAreas, a.id) })} style={chipStyle(form.selectedAreas.includes(a.id))}>{a.name}</button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
              <button onClick={() => setShowCreate(false)} style={{ padding: "9px 18px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "7px", background: "white", cursor: "pointer", color: "#374151" }}>Cancel</button>
              <button onClick={createListing} disabled={saving || !form.business_name.trim()} style={{ padding: "9px 18px", fontSize: "13px", fontWeight: "600", border: "none", borderRadius: "7px", background: saving ? "#93c5fd" : "#2563eb", cursor: "pointer", color: "white" }}>
                {saving ? "Saving..." : "Create listing"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
