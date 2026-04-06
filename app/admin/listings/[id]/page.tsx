"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const TRADE_BODIES = [
  "NICEIC", "Gas Safe", "NAPIT", "OFTEC", "CIPHE", "APHC", "FMB",
  "NHBC", "RIBA", "RICS", "TrustMark", "Which? Trusted Trader",
  "Checkatrade Approved", "CHAS", "Constructionline",
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", fontSize: "13px",
  border: "1px solid #e2e8f0", borderRadius: "8px",
  outline: "none", boxSizing: "border-box", background: "#f8fafc",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: "500", color: "#475569",
  display: "block", marginBottom: "5px",
};

const sectionStyle: React.CSSProperties = {
  background: "white", border: "1px solid #e2e8f0",
  borderRadius: "12px", padding: "22px 24px", marginBottom: "16px",
};

const sectionHeadStyle: React.CSSProperties = {
  fontSize: "14px", fontWeight: "600", color: "#0f172a",
  marginBottom: "16px", paddingBottom: "12px",
  borderBottom: "1px solid #f1f5f9",
  display: "flex", alignItems: "center", gap: "8px",
};

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [tradeBodies, setTradeBodies] = useState<string[]>([]);
  const [form, setForm] = useState<any>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => { fetchData(); }, [id]);

  async function fetchData() {
    setLoading(true);
    const [
      { data: tp },
      { data: cats },
      { data: areasData },
      { data: tpCats },
      { data: tpAreas },
    ] = await Promise.all([
      supabase.from("tradespeople").select("*").eq("id", id).single(),
      supabase.from("categories").select("id, name").order("name"),
      supabase.from("areas").select("id, name").order("name"),
      supabase.from("tradesperson_categories").select("category_id").eq("tradesperson_id", id),
      supabase.from("tradesperson_areas").select("area_id").eq("tradesperson_id", id),
    ]);
    setForm(tp ?? {});
    setCategories(cats ?? []);
    setAreas(areasData ?? []);
    setSelectedCategories(tpCats?.map((c) => c.category_id) ?? []);
    setSelectedAreas(tpAreas?.map((a) => a.area_id) ?? []);
    setTradeBodies(tp?.trade_bodies ?? []);
    if (tp?.logo_url) setLogoPreview(tp.logo_url);
    setLoading(false);
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function uploadLogo(): Promise<string> {
    if (!logoFile) return form.logo_url ?? "";
    const ext = logoFile.name.split(".").pop();
    const path = `logos/${id}.${ext}`;
    const { error } = await supabase.storage.from("logos").upload(path, logoFile, { upsert: true });
    if (error) return form.logo_url ?? "";
    const { data } = supabase.storage.from("logos").getPublicUrl(path);
    return data.publicUrl;
  }

  async function save() {
    setSaving(true);
    setSaveError("");
    setSaved(false);
    const logoUrl = await uploadLogo();

    const res = await fetch("/api/admin/update-listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        form,
        selectedAreas,
        selectedCategories,
        tradeBodies,
        logoUrl,
      }),
    });

    const result = await res.json();

    if (!res.ok || result.error) {
      setSaveError(result.error ?? "Save failed");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function toggleChip(list: number[], val: number) {
    return list.includes(val) ? list.filter((x) => x !== val) : [...list, val];
  }

  function toggleTradeBody(name: string) {
    setTradeBodies((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  }

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px", fontSize: "12px", fontWeight: "500",
    borderRadius: "999px", cursor: "pointer",
    border: `1px solid ${active ? "#2563eb" : "#e2e8f0"}`,
    background: active ? "#eff6ff" : "white",
    color: active ? "#1e40af" : "#475569",
    transition: "all 0.15s",
  });

  const btnBase: React.CSSProperties = {
    fontSize: "13px", fontWeight: "600", borderRadius: "8px",
    cursor: "pointer", transition: "all 0.15s",
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <div style={{ fontSize: "14px", color: "#94a3b8" }}>Loading listing...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "820px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button onClick={() => router.push("/admin/listings")} style={{
            width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "2px" }}>Editing</div>
            <h1 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", margin: 0 }}>{form.business_name || "Listing"}</h1>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {saved && (
            <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              Saved
            </span>
          )}
          {saveError && <span style={{ fontSize: "13px", color: "#ef4444", fontWeight: "500" }}>{saveError}</span>}
          <button onClick={() => router.push("/admin/listings")} style={{ ...btnBase, padding: "9px 18px", border: "1px solid #e2e8f0", background: "white", color: "#475569" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ ...btnBase, padding: "9px 22px", border: "none", background: saving ? "#93c5fd" : "#2563eb", color: "white" }}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/* Status & Tier */}
      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09" /></svg>
          Status and tier
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", alignItems: "end" }}>
          <div>
            <label style={labelStyle}>Membership tier</label>
            <select value={form.membership_tier ?? "free"} onChange={(e) => setForm({ ...form, membership_tier: e.target.value })} style={inputStyle}>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="featured">Featured</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Billing cycle</label>
            <select value={form.billing_cycle ?? "monthly"} onChange={(e) => setForm({ ...form, billing_cycle: e.target.value })} style={inputStyle}>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "20px", paddingBottom: "4px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", fontWeight: "500", cursor: "pointer", color: "#0f172a" }}>
              <input type="checkbox" checked={form.approved ?? false} onChange={(e) => setForm({ ...form, approved: e.target.checked })} style={{ width: "16px", height: "16px", accentColor: "#2563eb" }} />
              Approved
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", fontWeight: "500", cursor: "pointer", color: "#0f172a" }}>
              <input type="checkbox" checked={form.is_featured ?? false} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} style={{ width: "16px", height: "16px", accentColor: "#2563eb" }} />
              Featured
            </label>
          </div>
        </div>
      </div>

      {/* Business Details */}
      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>
          Business details
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Business name</label>
            <input value={form.business_name ?? ""} onChange={(e) => setForm({ ...form, business_name: e.target.value })} style={inputStyle} />
          </div>
          {[
            { f: "contact_name", l: "Contact name" },
            { f: "email", l: "Email" },
            { f: "main_phone", l: "Main phone" },
            { f: "mobile_phone", l: "Mobile phone" },
            { f: "website", l: "Website" },
            { f: "town", l: "Town" },
          ].map(({ f, l }) => (
            <div key={f}>
              <label style={labelStyle}>{l}</label>
              <input value={form[f] ?? ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} style={inputStyle} />
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.5" }} />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
          Logo
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          {logoPreview ? (
            <img src={logoPreview} alt="logo" style={{ width: "72px", height: "72px", borderRadius: "10px", objectFit: "cover", border: "1px solid #e2e8f0" }} />
          ) : (
            <div style={{ width: "72px", height: "72px", borderRadius: "10px", background: "#f1f5f9", border: "1px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            </div>
          )}
          <div>
            <label style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", fontSize: "13px", fontWeight: "500",
              border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer",
              background: "white", color: "#374151",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              Upload logo
              <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: "none" }} />
            </label>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0" }}>PNG, JPG or WebP. Replaces existing on save.</p>
          </div>
        </div>
      </div>

      {/* Social & Messaging */}
      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
          Social and messaging
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
          {[
            { f: "whatsapp_url", l: "WhatsApp" },
            { f: "instagram_url", l: "Instagram" },
            { f: "facebook_url", l: "Facebook" },
            { f: "twitter_url", l: "X / Twitter" },
            { f: "linkedin_url", l: "LinkedIn" },
            { f: "tiktok_url", l: "TikTok" },
          ].map(({ f, l }) => (
            <div key={f}>
              <label style={labelStyle}>{l}</label>
              <input value={form[f] ?? ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} style={inputStyle} placeholder="https://..." />
            </div>
          ))}
        </div>
      </div>

      {/* Trade Body Accreditations */}
      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          Trade body accreditations
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {TRADE_BODIES.map((name) => (
            <button key={name} type="button" onClick={() => toggleTradeBody(name)} style={chipStyle(tradeBodies.includes(name))}>{name}</button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          Categories
          <span style={{ fontSize: "12px", fontWeight: "400", color: "#94a3b8", marginLeft: "auto" }}>{selectedCategories.length} selected</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {categories.map((c) => (
            <button key={c.id} type="button" onClick={() => setSelectedCategories(toggleChip(selectedCategories, c.id))} style={chipStyle(selectedCategories.includes(c.id))}>{c.name}</button>
          ))}
        </div>
      </div>

      {/* Areas Covered */}
      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
          Areas covered
          <span style={{ fontSize: "12px", fontWeight: "400", color: "#94a3b8", marginLeft: "auto" }}>{selectedAreas.length} selected</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {areas.map((a) => (
            <button key={a.id} type="button" onClick={() => setSelectedAreas(toggleChip(selectedAreas, a.id))} style={chipStyle(selectedAreas.includes(a.id))}>{a.name}</button>
          ))}
        </div>
      </div>

      {/* Bottom save bar */}
      <div style={{
        display: "flex", justifyContent: "flex-end", gap: "10px",
        paddingTop: "12px", paddingBottom: "40px",
        alignItems: "center",
      }}>
        {saved && (
          <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            Changes saved
          </span>
        )}
        {saveError && <span style={{ fontSize: "13px", color: "#ef4444" }}>{saveError}</span>}
        <button onClick={() => router.push("/admin/listings")} style={{ ...btnBase, padding: "10px 20px", border: "1px solid #e2e8f0", background: "white", color: "#475569" }}>Cancel</button>
        <button onClick={save} disabled={saving} style={{ ...btnBase, padding: "10px 24px", border: "none", background: saving ? "#93c5fd" : "#2563eb", color: "white" }}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
