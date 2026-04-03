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
  width: "100%", padding: "8px 10px", fontSize: "13px",
  border: "1px solid #e2e8f0", borderRadius: "6px",
  outline: "none", boxSizing: "border-box", background: "white",
};
const labelStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: "500", color: "#374151",
  display: "block", marginBottom: "4px",
};
const sectionStyle: React.CSSProperties = {
  background: "white", border: "1px solid #e2e8f0",
  borderRadius: "10px", padding: "20px 24px", marginBottom: "16px",
};
const sectionHeadStyle: React.CSSProperties = {
  fontSize: "13px", fontWeight: "700", color: "#0f172a",
  marginBottom: "16px", paddingBottom: "10px",
  borderBottom: "1px solid #f1f5f9",
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
    setTimeout(() => setSaved(false), 2500);
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
    padding: "5px 12px", fontSize: "12px", fontWeight: "500",
    borderRadius: "999px", cursor: "pointer",
    border: `1px solid ${active ? "#2563eb" : "#e2e8f0"}`,
    background: active ? "#dbeafe" : "white",
    color: active ? "#1e40af" : "#374151",
  });

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
      <p style={{ color: "#94a3b8", fontSize: "14px" }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: "820px" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => router.push("/admin/listings")} style={{ fontSize: "13px", color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            ← Back
          </button>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Edit Listing</h1>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>{form.business_name}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {saved && <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: "500" }}>Saved!</span>}
          {saveError && <span style={{ fontSize: "13px", color: "#ef4444", fontWeight: "500" }}>{saveError}</span>}
          <button onClick={() => router.push("/admin/listings")} style={{ padding: "9px 18px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "7px", background: "white", cursor: "pointer", color: "#374151" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding: "9px 20px", fontSize: "13px", fontWeight: "600", border: "none", borderRadius: "7px", background: saving ? "#93c5fd" : "#2563eb", cursor: "pointer", color: "white" }}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>Status &amp; Tier</div>
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
          <div style={{ display: "flex", gap: "20px", paddingBottom: "2px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
              <input type="checkbox" checked={form.approved ?? false} onChange={(e) => setForm({ ...form, approved: e.target.checked })} style={{ width: "15px", height: "15px" }} />
              Approved
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
              <input type="checkbox" checked={form.is_featured ?? false} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} style={{ width: "15px", height: "15px" }} />
              Featured
            </label>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>Business Details</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Business name</label>
            <input value={form.business_name ?? ""} onChange={(e) => setForm({ ...form, business_name: e.target.value })} style={inputStyle} />
          </div>
          {[
            { f: "contact_name", l: "Contact name" }, { f: "town", l: "Town" },
            { f: "phone", l: "Phone" }, { f: "mobile", l: "Mobile" },
            { f: "email", l: "Email" }, { f: "website", l: "Website" },
          ].map(({ f, l }) => (
            <div key={f}>
              <label style={labelStyle}>{l}</label>
              <input value={form[f] ?? ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} style={inputStyle} />
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>Logo</div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {logoPreview ? (
            <img src={logoPreview} alt="logo" style={{ width: "64px", height: "64px", borderRadius: "8px", objectFit: "cover", border: "1px solid #e2e8f0" }} />
          ) : (
            <div style={{ width: "64px", height: "64px", borderRadius: "8px", background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#94a3b8" }}>No logo</div>
          )}
          <div>
            <input type="file" accept="image/*" onChange={handleLogoChange} style={{ fontSize: "13px" }} />
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0" }}>PNG, JPG or WebP. Replaces existing logo on save.</p>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>Social &amp; Messaging</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
          {[
            { f: "whatsapp_url", l: "WhatsApp" }, { f: "instagram_url", l: "Instagram" },
            { f: "facebook_url", l: "Facebook" }, { f: "twitter_url", l: "X / Twitter" },
            { f: "linkedin_url", l: "LinkedIn" }, { f: "tiktok_url", l: "TikTok" },
          ].map(({ f, l }) => (
            <div key={f}>
              <label style={labelStyle}>{l}</label>
              <input value={form[f] ?? ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} style={inputStyle} placeholder="https://..." />
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>Trade Body Accreditations</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {TRADE_BODIES.map((name) => (
            <button key={name} type="button" onClick={() => toggleTradeBody(name)} style={chipStyle(tradeBodies.includes(name))}>{name}</button>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>Categories</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {categories.map((c) => (
            <button key={c.id} type="button" onClick={() => setSelectedCategories(toggleChip(selectedCategories, c.id))} style={chipStyle(selectedCategories.includes(c.id))}>{c.name}</button>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeadStyle}>Areas Covered</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {areas.map((a) => (
            <button key={a.id} type="button" onClick={() => setSelectedAreas(toggleChip(selectedAreas, a.id))} style={chipStyle(selectedAreas.includes(a.id))}>{a.name}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px", paddingBottom: "40px" }}>
        {saved && <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: "500", alignSelf: "center" }}>Changes saved!</span>}
        {saveError && <span style={{ fontSize: "13px", color: "#ef4444", alignSelf: "center" }}>{saveError}</span>}
        <button onClick={() => router.push("/admin/listings")} style={{ padding: "10px 20px", fontSize: "13px", border: "1px solid #e2e8f0", borderRadius: "7px", background: "white", cursor: "pointer", color: "#374151" }}>Cancel</button>
        <button onClick={save} disabled={saving} style={{ padding: "10px 22px", fontSize: "13px", fontWeight: "600", border: "none", borderRadius: "7px", background: saving ? "#93c5fd" : "#2563eb", cursor: "pointer", color: "white" }}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
