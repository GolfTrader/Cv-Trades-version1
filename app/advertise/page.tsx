'use client';

import { useState } from "react";

const AREAS = [
  "Coventry", "Kenilworth", "Leamington Spa", "Warwick", "Stratford-upon-Avon",
  "Bedworth", "Nuneaton", "Atherstone", "Southam", "Rugby"
];

const CATEGORIES = [
  "Plumbing", "Electrical", "Building", "Landscaping", "Plastering",
  "Roofing", "Decorating", "Kitchens", "Bathrooms", "Flooring",
  "Glazing", "Security", "Scaffolding", "Cleaning", "Waste"
];

const TRADE_BODIES = [
  "Gas Safe Register", "FENSA", "NICEIC", "NAPIT", "ELECSA",
  "CHAS", "TrustMark", "NHBC", "Which? Trusted Trader",
  "Federation of Master Builders", "CORGI Registered", "HETAS",
  "OFTEC", "BESCA", "SafeContractor"
];

const PACKAGES = [
  {
    id: "free",
    name: "Free Listing",
    monthlyPrice: 0,
    annualPrice: 0,
    badge: null,
    color: "slate",
    description: "Get found by local customers at no cost.",
    features: [
      "Business name and phone number",
      "Website link",
      "Searchable in directory",
      "Basic profile page",
    ],
    notIncluded: [
      "Business logo",
      "Description",
      "Trade body badges",
      "Social media links",
      "Reviews",
      "Featured placement",
    ],
  },
  {
    id: "premium",
    name: "Premium Listing",
    monthlyPrice: 40,
    annualPrice: 384,
    badge: "Great Value",
    color: "blue",
    description: "Full profile with everything customers need to choose you.",
    features: [
      "Everything in Free",
      "Full business description",
      "Business logo",
      "Star ratings and reviews",
      "Trade body accreditation badges",
      "Social media links",
      "Mobile and WhatsApp contact",
      "Priority above free listings",
    ],
    notIncluded: [
      "Top 3 featured placement",
      "Homepage carousel",
    ],
  },
  {
    id: "featured",
    name: "Featured Listing",
    monthlyPrice: 75,
    annualPrice: 720,
    badge: "Most Powerful",
    color: "amber",
    description: "Maximum visibility with top 3 positions and homepage spotlight.",
    features: [
      "Everything in Premium",
      "Top 3 results placement",
      "Homepage rotating carousel",
      "Featured badge on profile",
      "Stand out from competitors",
      "Maximum local exposure",
    ],
    notIncluded: [],
  },
];

type PackageId = "free" | "premium" | "featured";

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#94a3b8" opacity="0.15" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AdvertisePage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [membershipTier, setMembershipTier] = useState<PackageId>("premium");
  const [selectedTradeBodies, setSelectedTradeBodies] = useState<string[]>([]);

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
    setSelectedAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);

  const toggleCategory = (cat: string) =>
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const toggleTradeBody = (body: string) =>
    setSelectedTradeBodies(prev => prev.includes(body) ? prev.filter(b => b !== body) : [...prev, body]);

  const isPaid = membershipTier === "premium" || membershipTier === "featured";
  const selectedPkg = PACKAGES.find(p => p.id === membershipTier)!;

  const getPrice = (pkg: typeof PACKAGES[0]) => {
    if (pkg.monthlyPrice === 0) return "Free";
    if (billingCycle === "annual") return `\u00A3${pkg.annualPrice}/yr`;
    return `\u00A3${pkg.monthlyPrice}/mo`;
  };

  const getSaving = (pkg: typeof PACKAGES[0]) => {
    if (pkg.monthlyPrice === 0) return null;
    const annualIfMonthly = pkg.monthlyPrice * 12;
    const saving = annualIfMonthly - pkg.annualPrice;
    return saving;
  };

  const totalSteps = membershipTier === "free" ? 3 : 4;
  const stepLabels = membershipTier === "free"
    ? ["Plan", "Details", "Coverage"]
    : ["Plan", "Details", "Coverage", "Online"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
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
      formData.append("membership_tier", membershipTier);
      formData.append("billing_cycle", billingCycle);
      formData.append("trade_bodies", JSON.stringify(selectedTradeBodies));
      if (logoFile) formData.append("logo", logoFile);

      const res = await fetch("/api/tradespeople", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Shared input classes
  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10 transition-all";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-2";
  const cardClass = "rounded-2xl bg-white border border-slate-200/80 shadow-sm p-7 sm:p-8";
  const sectionGap = "space-y-6";

  // THANK YOU SCREEN
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full">
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20l8 8 14-14" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-4">Application received!</h1>
            <p className="text-slate-300 text-base leading-relaxed max-w-sm mx-auto">
              Here is exactly what happens next.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-7 mb-8 space-y-6">
            {[
              {
                n: "1",
                color: "bg-blue-500",
                title: isPaid ? "Invoice on its way" : "Application received",
                body: isPaid
                  ? `We will send an invoice to ${form.email} for your ${selectedPkg.name} (${billingCycle === "annual" ? `\u00A3${selectedPkg.annualPrice}/year` : `\u00A3${selectedPkg.monthlyPrice}/month`}).`
                  : `We have received your free listing application for ${form.business_name}.`,
              },
              {
                n: "2",
                color: "bg-violet-500",
                title: isPaid ? "We will finalise your profile" : "Quick review",
                body: isPaid
                  ? "Once payment is received, our team will review and polish your listing. We will reach out if we need anything."
                  : "Our team will review your listing within 1 to 2 business days.",
              },
              {
                n: "3",
                color: "bg-emerald-500",
                title: "Go live and start getting customers",
                body: "Your profile goes live on CV Trades Directory, reaching homeowners across Coventry and Warwickshire actively searching for your services.",
              },
            ].map(s => (
              <div key={s.n} className="flex gap-5">
                <div className={`h-10 w-10 rounded-full ${s.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {s.n}
                </div>
                <div>
                  <p className="text-white font-bold text-base">{s.title}</p>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Your submission</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Business</span>
                <span className="text-white font-semibold">{form.business_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan</span>
                <span className="text-white font-semibold capitalize">{selectedPkg.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="text-white font-semibold">{form.email}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <a href="/"
              className="flex items-center justify-center gap-2 w-full bg-white text-slate-900 font-bold rounded-xl py-4 text-base hover:bg-slate-100 transition-colors">
              Back to Homepage
            </a>
            <a href="/contact"
              className="flex items-center justify-center gap-2 w-full border border-white/20 text-white rounded-xl py-3.5 text-sm hover:bg-white/5 transition-colors">
              Got a question? Contact us
            </a>
          </div>
        </div>
      </div>
    );
  }

  // MAIN PAGE
  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[80px] rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative py-16 md:py-20">
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-slate-600">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-slate-300">Get Listed</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/20 px-4 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-semibold text-blue-300 uppercase tracking-wide">Now accepting applications</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
              Grow your trades<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                business locally
              </span>
            </h1>

            <p className="mt-5 text-slate-300 text-lg leading-relaxed max-w-xl">
              Join CV Trades Directory &mdash; the go-to directory for homeowners across Coventry &amp; Warwickshire finding trusted local tradespeople.
            </p>

            <div className="mt-10 flex flex-wrap gap-8">
              {[
                { value: "CV1\u2013CV47", label: "Postcode coverage" },
                { value: "100%", label: "Local homeowners" },
                { value: "Free", label: "To get started" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-3xl font-black text-white">{s.value}</p>
                  <p className="text-sm text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STEP INDICATOR */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all
                    ${step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-slate-100 text-slate-400"}`}>
                    {step > i + 1 ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`text-sm font-semibold hidden sm:inline ${step === i + 1 ? "text-slate-900" : step > i + 1 ? "text-emerald-600" : "text-slate-400"}`}>{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 rounded-full ${step > i + 1 ? "bg-emerald-500" : "bg-slate-100"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <form onSubmit={handleSubmit}>

          {/* STEP 1: CHOOSE PLAN */}
          {step === 1 && (
            <div className={sectionGap}>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Choose your plan</h2>
                <p className="text-slate-500 text-base mt-2">You can upgrade at any time. Cancel monthly plans anytime.</p>
              </div>

              {/* Billing toggle */}
              <div className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 px-5 py-3.5 shadow-sm w-fit">
                <span className={`text-sm font-semibold transition-colors ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"}`}>Monthly</span>
                <button type="button" onClick={() => setBillingCycle(prev => prev === "monthly" ? "annual" : "monthly")}
                  className={`relative h-7 w-12 rounded-full transition-colors ${billingCycle === "annual" ? "bg-blue-600" : "bg-slate-200"}`}>
                  <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${billingCycle === "annual" ? "translate-x-5.5" : "translate-x-0.5"}`} />
                </button>
                <span className={`text-sm font-semibold transition-colors ${billingCycle === "annual" ? "text-slate-900" : "text-slate-400"}`}>Annual</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">Save 20%</span>
              </div>

              {/* Package cards */}
              <div className="grid gap-5 sm:grid-cols-3">
                {PACKAGES.map(pkg => {
                  const isSelected = membershipTier === pkg.id;
                  const saving = getSaving(pkg);
                  const borderClass = isSelected
                    ? pkg.color === "amber" ? "border-amber-400 shadow-lg shadow-amber-100/50 ring-1 ring-amber-400/30"
                    : pkg.color === "blue" ? "border-blue-500 shadow-lg shadow-blue-100/50 ring-1 ring-blue-500/30"
                    : "border-slate-400 shadow-md"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md";

                  return (
                    <button key={pkg.id} type="button" onClick={() => setMembershipTier(pkg.id as PackageId)}
                      className={`relative rounded-2xl border-2 p-6 text-left transition-all bg-white ${borderClass}`}>

                      {pkg.badge && (
                        <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-bold text-white whitespace-nowrap shadow-sm
                          ${pkg.color === "amber" ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-blue-600 to-blue-500"}`}>
                          {pkg.badge}
                        </div>
                      )}

                      <div className={`absolute top-4 right-4 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${isSelected
                          ? pkg.color === "amber" ? "border-amber-400 bg-amber-400"
                          : pkg.color === "blue" ? "border-blue-500 bg-blue-500"
                          : "border-slate-400 bg-slate-400"
                          : "border-slate-200"}`}>
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>

                      <p className="font-black text-slate-900 text-base pr-8">{pkg.name}</p>
                      <p className="text-sm text-slate-500 mt-1 mb-4 leading-relaxed">{pkg.description}</p>

                      <p className={`text-3xl font-black mb-1
                        ${pkg.color === "amber" ? "text-amber-600" : pkg.color === "blue" ? "text-blue-600" : "text-slate-900"}`}>
                        {getPrice(pkg)}
                      </p>
                      {saving && billingCycle === "annual" && (
                        <p className="text-sm text-emerald-600 font-bold mb-4">Save {"\u00A3"}{saving}/year</p>
                      )}
                      {saving && billingCycle === "monthly" && (
                        <p className="text-sm text-slate-400 mb-4">or {"\u00A3"}{pkg.annualPrice}/yr (save {"\u00A3"}{saving})</p>
                      )}
                      {!saving && <div className="mb-4" />}

                      <ul className="space-y-2">
                        {pkg.features.map(f => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                            <CheckIcon className={`flex-shrink-0 mt-0.5 ${pkg.color === "amber" ? "text-amber-500" : pkg.color === "blue" ? "text-blue-500" : "text-slate-500"}`} />
                            {f}
                          </li>
                        ))}
                        {pkg.notIncluded.map(f => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-400">
                            <CrossIcon />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              {/* Context messages */}
              {membershipTier === "featured" && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 flex gap-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                    <path d="M10 2l2 4 4.5.7-3.3 3.1.8 4.5L10 12.2 5.9 14.3l.8-4.5L3.5 6.7 8 6l2-4z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.5"/>
                  </svg>
                  <div className="text-sm text-amber-800 leading-relaxed">
                    <strong className="font-bold">Featured Listing:</strong> After submitting, we will send an invoice to your email. Your listing goes live at the top of results once payment is received and approved.
                  </div>
                </div>
              )}
              {membershipTier === "premium" && (
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-5 flex gap-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5 text-blue-500">
                    <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 9v5M10 7v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div className="text-sm text-blue-800 leading-relaxed">
                    <strong className="font-bold">Premium Listing:</strong> We will invoice you after reviewing your application. Full profile goes live once payment is confirmed.
                  </div>
                </div>
              )}
              {membershipTier === "free" && (
                <div className="rounded-xl bg-slate-100 border border-slate-200 p-5 flex gap-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5 text-slate-500">
                    <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <strong className="font-bold">Free Listing:</strong> No payment needed. We will review your application and your listing goes live within 1 to 2 business days.
                  </div>
                </div>
              )}

              <button type="button" onClick={() => setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-5 text-lg transition-all shadow-sm hover:shadow-md active:scale-[0.99]">
                Continue with {selectedPkg.name}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block ml-2">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* STEP 2: BUSINESS DETAILS */}
          {step === 2 && (
            <div className={sectionGap}>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Tell us about your business</h2>
                <p className="text-slate-500 text-base mt-2">
                  {isPaid ? "This information will appear on your public profile." : "Just the basics. You can always upgrade later for a full profile."}
                </p>
              </div>

              <div className={cardClass}>
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-slate-600">
                      <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M7 10h6M7 7h6M7 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Business details</h3>
                    <p className="text-sm text-slate-400">Required information</p>
                  </div>
                </div>

                <div className={sectionGap}>
                  <div>
                    <label className={labelClass}>
                      Business name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" value={form.business_name} onChange={e => update("business_name", e.target.value)}
                      placeholder="e.g. Smith Plumbing Services"
                      className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Email address <span className="text-red-400">*</span>
                    </label>
                    <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                      placeholder="info@yourbusiness.co.uk"
                      className={inputClass} />
                    {isPaid && <p className="text-sm text-slate-400 mt-2">Your invoice will be sent to this address</p>}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Main phone <span className="text-red-400">*</span>
                      </label>
                      <input type="tel" value={form.main_phone} onChange={e => update("main_phone", e.target.value)}
                        placeholder="02476 123456"
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Website
                      </label>
                      <input type="text" value={form.website} onChange={e => update("website", e.target.value)}
                        placeholder="www.yourbusiness.co.uk"
                        className={inputClass} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium/Featured fields */}
              {isPaid && (
                <div className={cardClass}>
                  <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue-600">
                        <path d="M10 2l2 4 4.5.7-3.3 3.1.8 4.5L10 12.2 5.9 14.3l.8-4.5L3.5 6.7 8 6l2-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Premium profile</h3>
                      <p className="text-sm text-blue-500 font-medium">Make your listing stand out</p>
                    </div>
                  </div>

                  <div className={sectionGap}>
                    <div>
                      <label className={labelClass}>
                        Business description <span className="text-red-400">*</span>
                      </label>
                      <textarea value={form.description} onChange={e => update("description", e.target.value)}
                        rows={5} placeholder="Tell customers about your business, your experience, and the services you offer..."
                        className={`${inputClass} resize-none`} />
                      <p className="text-sm text-slate-400 mt-2">This appears prominently on your profile. Make it count.</p>
                    </div>

                    <div>
                      <label className={labelClass}>Mobile number</label>
                      <input type="tel" value={form.mobile_phone} onChange={e => update("mobile_phone", e.target.value)}
                        placeholder="07700 123456"
                        className={inputClass} />
                    </div>

                    <div>
                      <label className={labelClass}>Business logo</label>
                      <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                        {logoFile ? (
                          <div className="flex items-center justify-center gap-4">
                            <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                                <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M3 16l5-4 4 3 3-2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="text-base font-semibold text-slate-700">{logoFile.name}</p>
                              <button type="button" onClick={(e) => { e.stopPropagation(); setLogoFile(null); }} className="text-sm text-red-500 hover:underline mt-0.5">Remove file</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="h-14 w-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 group-hover:border-blue-300 transition-colors">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-400 group-hover:text-blue-500 transition-colors">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </div>
                            <p className="text-base font-semibold text-slate-700">Click to upload your logo</p>
                            <p className="text-sm text-slate-400 mt-1">PNG, JPG or WebP &mdash; max 5MB</p>
                          </>
                        )}
                        <input type="file" accept="image/jpeg,image/png,image/webp"
                          onChange={e => setLogoFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Trade body accreditations</label>
                      <p className="text-sm text-slate-400 mb-4">These appear as verified badges on your profile &mdash; a major trust signal for customers.</p>
                      <div className="flex flex-wrap gap-2.5">
                        {TRADE_BODIES.map(body => (
                          <button key={body} type="button" onClick={() => toggleTradeBody(body)}
                            className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all
                              ${selectedTradeBodies.includes(body)
                                ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm"}`}>
                            {selectedTradeBodies.includes(body) && (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block mr-1.5 -mt-0.5">
                                <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                            {body}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-xl p-4 font-medium">{error}</div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border-2 border-slate-200 py-4 text-base font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Back
                </button>
                <button type="button" onClick={() => {
                  if (!form.business_name || !form.email || !form.main_phone) { setError("Please fill in Business Name, Email and Main Phone."); return; }
                  if (isPaid && !form.description) { setError("Please add a business description for your premium profile."); return; }
                  setError(""); setStep(3);
                }}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-4 text-base transition-all shadow-sm hover:shadow-md active:scale-[0.99]">
                  Continue to coverage
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block ml-2">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: COVERAGE */}
          {step === 3 && (
            <div className={sectionGap}>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Where do you work?</h2>
                <p className="text-slate-500 text-base mt-2">Select your areas and trade categories so customers can find you.</p>
              </div>

              <div className={cardClass}>
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-slate-600">
                      <path d="M10 2C6.7 2 4 4.7 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Areas you cover</h3>
                    <p className="text-sm text-slate-400">Select all areas you work in</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {AREAS.map(area => (
                    <button key={area} type="button" onClick={() => toggleArea(area)}
                      className={`rounded-full border-2 px-5 py-3 text-base font-medium transition-all
                        ${selectedAreas.includes(area)
                          ? "border-blue-500 bg-blue-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:shadow-sm"}`}>
                      {area}
                    </button>
                  ))}
                </div>
                {selectedAreas.length > 0 && (
                  <p className="text-sm text-blue-600 font-medium mt-4">{selectedAreas.length} area{selectedAreas.length > 1 ? "s" : ""} selected</p>
                )}
              </div>

              <div className={cardClass}>
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-slate-600">
                      <path d="M14.5 3.5l2 2-9 9H5.5v-2l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M12 6l2 2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Your trade categories</h3>
                    <p className="text-sm text-slate-400">Select all trades you offer</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map(cat => (
                    <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                      className={`rounded-full border-2 px-5 py-3 text-base font-medium transition-all
                        ${selectedCategories.includes(cat)
                          ? "border-blue-500 bg-blue-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:shadow-sm"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <p className="text-sm text-blue-600 font-medium mt-4">{selectedCategories.length} categor{selectedCategories.length > 1 ? "ies" : "y"} selected</p>
                )}
              </div>

              {/* Free tier summary + submit */}
              {membershipTier === "free" && (
                <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-7">
                  <h3 className="text-base font-bold text-white mb-5">Review your application</h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: "Plan", value: "Free Listing" },
                      { label: "Business", value: form.business_name },
                      { label: "Email", value: form.email },
                      { label: "Phone", value: form.main_phone },
                      { label: "Areas", value: selectedAreas.length > 0 ? selectedAreas.join(", ") : "None selected" },
                      { label: "Trades", value: selectedCategories.length > 0 ? selectedCategories.join(", ") : "None selected" },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between gap-4">
                        <span className="text-slate-400 flex-shrink-0">{row.label}</span>
                        <span className="text-white font-medium text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-xl p-4 font-medium">{error}</div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 rounded-xl border-2 border-slate-200 py-4 text-base font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Back
                </button>
                {membershipTier === "free" ? (
                  <button type="submit" disabled={submitting}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl py-5 text-lg transition-all shadow-sm hover:shadow-md active:scale-[0.99]">
                    {submitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                          <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        Submitting...
                      </span>
                    ) : "Submit Free Application"}
                  </button>
                ) : (
                  <button type="button" onClick={() => { setError(""); setStep(4); }}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-4 text-base transition-all shadow-sm hover:shadow-md active:scale-[0.99]">
                    Continue to online presence
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block ml-2">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: ONLINE PRESENCE (paid only) */}
          {step === 4 && isPaid && (
            <div className={sectionGap}>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Online presence</h2>
                <p className="text-slate-500 text-base mt-2">All optional &mdash; add whatever you have. These help customers find you across the web.</p>
              </div>

              <div className={cardClass}>
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-slate-600">
                      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M2 10h16M10 2c2.5 2.5 4 5 4 8s-1.5 5.5-4 8c-2.5-2.5-4-5-4-8s1.5-5.5 4-8z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Social media links</h3>
                    <p className="text-sm text-slate-400">All optional</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    { field: "facebook_url", label: "Facebook", placeholder: "https://facebook.com/yourbusiness", icon: "F", color: "bg-blue-600" },
                    { field: "instagram_url", label: "Instagram", placeholder: "https://instagram.com/yourbusiness", icon: "I", color: "bg-gradient-to-br from-purple-600 to-pink-500" },
                    { field: "youtube_url", label: "YouTube", placeholder: "https://youtube.com/yourchannel", icon: "Y", color: "bg-red-600" },
                    { field: "linkedin_url", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourbusiness", icon: "L", color: "bg-blue-700" },
                    { field: "whatsapp_url", label: "WhatsApp", placeholder: "07700123456", icon: "W", color: "bg-emerald-600" },
                  ].map(({ field, label, placeholder, icon, color }) => (
                    <div key={field} className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0 text-white text-base font-bold shadow-sm`}>
                        {icon}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-600 mb-1.5">{label}</label>
                        <input type="text" value={(form as any)[field]} onChange={e => update(field, e.target.value)}
                          placeholder={placeholder}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final summary */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-7">
                <h3 className="text-base font-bold text-white mb-5">Review your application</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Plan", value: `${selectedPkg.name} \u2014 ${billingCycle === "annual" ? `\u00A3${selectedPkg.annualPrice}/year` : `\u00A3${selectedPkg.monthlyPrice}/month`}` },
                    { label: "Business", value: form.business_name },
                    { label: "Email", value: form.email },
                    { label: "Areas", value: selectedAreas.length > 0 ? selectedAreas.join(", ") : "None selected" },
                    { label: "Trades", value: selectedCategories.length > 0 ? selectedCategories.join(", ") : "None selected" },
                    ...(selectedTradeBodies.length > 0 ? [{ label: "Accreditations", value: selectedTradeBodies.join(", ") }] : []),
                  ].map(row => (
                    <div key={row.label} className="flex justify-between gap-4">
                      <span className="text-slate-400 flex-shrink-0">{row.label}</span>
                      <span className="text-white font-medium text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-xl p-4 font-medium">{error}</div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(3)}
                  className="flex-1 rounded-xl border-2 border-slate-200 py-4 text-base font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Back
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl py-5 text-lg transition-all shadow-sm hover:shadow-md active:scale-[0.99]">
                  {submitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                        <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Submitting...
                    </span>
                  ) : `Submit ${selectedPkg.name} Application`}
                </button>
              </div>

              <p className="text-center text-sm text-slate-400">
                By submitting you agree to our{" "}
                <a href="/terms" className="text-blue-600 hover:underline font-medium">Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
              </p>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
