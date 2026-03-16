'use client';

import { useState } from "react";
import Link from "next/link";

const AREAS = [
  "Coventry", "Kenilworth", "Leamington Spa", "Warwick", "Stratford",
  "Bedworth", "Nuneaton", "Atherstone", "Southam"
];

const CATEGORIES = [
  "Plumbing", "Electrical", "Building", "Landscaping", "Plastering",
  "Roofing", "Decorating", "Kitchens", "Bathrooms", "Flooring",
  "Glazing", "Security", "Scaffolding", "Cleaning", "Waste"
];

export default function AdvertisePage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [form, setForm] = useState({
    business_name: "",
    description: "",
    main_phone: "",
    mobile_phone: "",
    email: "",
    website: "",
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
    linkedin_url: "",
    whatsapp_url: "",
  });
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const toggleArea = (area: string) =>
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );

  const toggleCategory = (cat: string) =>
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name || !form.description || !form.email) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      // Get area and category IDs from the API
      const [areasRes, catsRes] = await Promise.all([
        fetch("/api/areas"),
        fetch("/api/categories"),
      ]);
      const areasData = await areasRes.json();
      const catsData = await catsRes.json();

      const areaIds = areasData
        .filter((a: any) => selectedAreas.includes(a.name))
        .map((a: any) => a.id);
      const categoryIds = catsData
        .filter((c: any) => selectedCategories.includes(c.name))
        .map((c: any) => c.id);

      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      formData.append("areas", JSON.stringify(areaIds));
      formData.append("categories", JSON.stringify(categoryIds));
      if (logoFile) formData.append("logo", logoFile);

      const res = await fetch("/api/tradespeople", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">You're submitted!</h1>
          <p className="text-slate-600 text-sm mb-6">
            Thank you for joining CV Trades Directory. We'll review your listing and it will go live shortly. We'll be in touch at <strong>{form.email}</strong>.
          </p>
          <Link href="/" className="btn-primary text-sm">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-14 text-white">
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-slate-300">Tradesperson Signup</span>
          </nav>
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Join CV Trades</p>
            <h1 className="text-3xl font-bold sm:text-4xl">List Your Business</h1>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Join the CV postcode's most trusted trades directory. Get found by local customers looking for your services.
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: "🎯", label: "Local visibility" },
              { icon: "⭐", label: "Customer reviews" },
              { icon: "📱", label: "Mobile optimised" },
              { icon: "🔍", label: "SEO friendly" },
            ].map(b => (
              <div key={b.label} className="rounded-xl bg-white/10 px-4 py-3 text-center border border-white/10">
                <p className="text-lg">{b.icon}</p>
                <p className="text-xs font-medium text-white/80 mt-1">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps indicator */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="container-page py-3">
          <div className="flex items-center gap-2 text-xs">
            {["Business Details", "Areas & Trades", "Online Presence"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors
                  ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-primary text-white" : "bg-slate-200 text-slate-500"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={step === i + 1 ? "font-semibold text-slate-800" : "text-slate-400"}>{label}</span>
                {i < 2 && <span className="text-slate-300 mx-1">›</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-10 max-w-2xl">
        <form onSubmit={handleSubmit}>

          {/* Step 1: Business Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-5">Business Details</h2>
                <div className="space-y-4">

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Business Name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" value={form.business_name} onChange={e => update("business_name", e.target.value)}
                      placeholder="e.g. Smith Plumbing Services"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Business Description <span className="text-red-400">*</span>
                    </label>
                    <textarea value={form.description} onChange={e => update("description", e.target.value)}
                      rows={4} placeholder="Tell customers about your business, experience and services..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                    <p className="mt-1 text-xs text-slate-400">{form.description.length}/500 characters</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Main Phone</label>
                      <input type="tel" value={form.main_phone} onChange={e => update("main_phone", e.target.value)}
                        placeholder="02476 123456"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile</label>
                      <input type="tel" value={form.mobile_phone} onChange={e => update("mobile_phone", e.target.value)}
                        placeholder="07700 123456"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                      placeholder="info@yourbusiness.co.uk"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Business Logo</label>
                    <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center hover:border-primary/40 transition-colors">
                      {logoFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-sm font-medium text-slate-700">{logoFile.name}</span>
                          <button type="button" onClick={() => setLogoFile(null)} className="text-xs text-red-400 hover:underline">Remove</button>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-slate-500 mb-2">📷 Upload your logo</p>
                          <p className="text-xs text-slate-400">PNG, JPG or WebP — max 5MB</p>
                        </>
                      )}
                      <input type="file" accept="image/jpeg,image/png,image/webp"
                        onChange={e => setLogoFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" onClick={() => {
                if (!form.business_name || !form.description || !form.email) { setError("Please fill in all required fields."); return; }
                setError(""); setStep(2);
              }} className="btn-primary w-full py-3">
                Continue to Areas & Trades →
              </button>
              {error && <p className="text-center text-sm text-red-500">{error}</p>}
            </div>
          )}

          {/* Step 2: Areas & Categories */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-1">Areas You Cover</h2>
                <p className="text-xs text-slate-400 mb-4">Select all areas you serve</p>
                <div className="flex flex-wrap gap-2">
                  {AREAS.map(area => (
                    <button key={area} type="button" onClick={() => toggleArea(area)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all
                        ${selectedAreas.includes(area)
                          ? "border-primary bg-primary text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/40"}`}>
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-1">Trade Categories</h2>
                <p className="text-xs text-slate-400 mb-4">Select all that apply to your business</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all
                        ${selectedCategories.includes(cat)
                          ? "border-primary bg-primary text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/40"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  ← Back
                </button>
                <button type="button" onClick={() => { setError(""); setStep(3); }}
                  className="btn-primary flex-1 py-3">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Online Presence */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-1">Online Presence</h2>
                <p className="text-xs text-slate-400 mb-5">All optional — add any that apply</p>
                <div className="space-y-4">
                  {[
                    { field: "website", label: "Website", placeholder: "https://www.yourbusiness.co.uk", icon: "🌐" },
                    { field: "facebook_url", label: "Facebook", placeholder: "https://facebook.com/yourbusiness", icon: "📘" },
                    { field: "instagram_url", label: "Instagram", placeholder: "https://instagram.com/yourbusiness", icon: "📸" },
                    { field: "youtube_url", label: "YouTube", placeholder: "https://youtube.com/yourchannel", icon: "▶️" },
                    { field: "linkedin_url", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourbusiness", icon: "💼" },
                    { field: "whatsapp_url", label: "WhatsApp Number", placeholder: "07700123456", icon: "💬" },
                  ].map(({ field, label, placeholder, icon }) => (
                    <div key={field} className="flex items-center gap-3">
                      <span className="text-xl w-7 text-center">{icon}</span>
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</label>
                        <input type="text" value={(form as any)[field]} onChange={e => update(field, e.target.value)}
                          placeholder={placeholder}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Review your submission</h3>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p><span className="font-semibold">Business:</span> {form.business_name}</p>
                  <p><span className="font-semibold">Email:</span> {form.email}</p>
                  <p><span className="font-semibold">Areas:</span> {selectedAreas.length > 0 ? selectedAreas.join(", ") : "None selected"}</p>
                  <p><span className="font-semibold">Trades:</span> {selectedCategories.length > 0 ? selectedCategories.join(", ") : "None selected"}</p>
                </div>
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  ← Back
                </button>
                <button type="submit" disabled={submitting}
                  className="btn-primary flex-1 py-3 disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit Listing ✓"}
                </button>
              </div>

              <p className="text-center text-xs text-slate-400">
                By submitting you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
