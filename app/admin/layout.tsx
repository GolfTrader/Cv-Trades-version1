"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";

/* ────────────────────────────────────────────
   TOAST NOTIFICATION SYSTEM
   ──────────────────────────────────────────── */
type Toast = { id: number; message: string; type: "success" | "error" | "info" };
type ToastContextType = { addToast: (message: string, type?: "success" | "error" | "info") => void };
const ToastContext = createContext<ToastContextType>({ addToast: () => {} });
export function useToast() { return useContext(ToastContext); }

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: number) => void }) {
  return (
    <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "8px", pointerEvents: "none" }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          pointerEvents: "auto",
          padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "500",
          display: "flex", alignItems: "center", gap: "8px", minWidth: "260px",
          background: t.type === "success" ? "#f0fdf4" : t.type === "error" ? "#fef2f2" : "#eff6ff",
          color: t.type === "success" ? "#166534" : t.type === "error" ? "#991b1b" : "#1e40af",
          border: `1px solid ${t.type === "success" ? "#bbf7d0" : t.type === "error" ? "#fecaca" : "#bfdbfe"}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          animation: "slideIn 0.3s ease-out",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {t.type === "success" && <path d="M20 6L9 17l-5-5" />}
            {t.type === "error" && <><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></>}
            {t.type === "info" && <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>}
          </svg>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => removeToast(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.5, fontSize: "16px", padding: "0 0 0 8px" }}>x</button>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   CTRL+K SEARCH MODAL
   ──────────────────────────────────────────── */
function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from("tradespeople")
        .select("id, business_name, email, membership_tier, approved")
        .or(`business_name.ilike.%${query}%,email.ilike.%${query}%,main_phone.ilike.%${query}%`)
        .order("business_name")
        .limit(8);
      setResults(data ?? []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 999, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "120px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "520px", background: "white", borderRadius: "12px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", borderBottom: "1px solid #f1f5f9" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search businesses, emails, phone numbers..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: "15px", color: "#0f172a", background: "transparent" }}
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
          />
          <kbd style={{ fontSize: "11px", padding: "2px 6px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "4px", color: "#94a3b8" }}>ESC</kbd>
        </div>
        <div style={{ maxHeight: "360px", overflowY: "auto" }}>
          {!query.trim() && (
            <div style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>Start typing to search listings...</div>
          )}
          {query.trim() && loading && (
            <div style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>Searching...</div>
          )}
          {query.trim() && !loading && results.length === 0 && (
            <div style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>No results found</div>
          )}
          {results.map((r) => {
            const tierColors: Record<string, { bg: string; color: string }> = {
              featured: { bg: "#fef3c7", color: "#92400e" },
              premium: { bg: "#dbeafe", color: "#1e40af" },
              free: { bg: "#f1f5f9", color: "#475569" },
            };
            const tc = tierColors[r.membership_tier] ?? tierColors.free;
            return (
              <button
                key={r.id}
                onClick={() => { router.push(`/admin/listings/${r.id}`); onClose(); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "12px 18px", border: "none", borderBottom: "1px solid #f8fafc",
                  background: "white", cursor: "pointer", textAlign: "left", transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>{r.business_name}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>{r.email}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "999px", background: tc.bg, color: tc.color, fontWeight: "600" }}>{r.membership_tier}</span>
                  <span style={{
                    fontSize: "11px", padding: "2px 8px", borderRadius: "999px", fontWeight: "600",
                    background: r.approved ? "#dcfce7" : "#fef3c7",
                    color: r.approved ? "#166534" : "#92400e",
                  }}>{r.approved ? "Live" : "Pending"}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "10px 18px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "16px", fontSize: "11px", color: "#94a3b8" }}>
          <span>Navigate with arrow keys</span>
          <span>Enter to select</span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   SIDEBAR NAV CONFIG
   ──────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    label: "Dashboard", href: "/admin",
    icon: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  },
  {
    label: "Listings", href: "/admin/listings",
    icon: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6" /></svg>,
    badge: true,
  },
  {
    label: "Reviews", href: "/admin/reviews",
    icon: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
  },
  {
    label: "Categories", href: "/admin/categories",
    icon: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>,
  },
  {
    label: "Areas", href: "/admin/areas",
    icon: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  },
  {
    label: "Subscribers", href: "/admin/subscribers",
    icon: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  },
];

const SETTINGS_ICON = (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>;

/* ────────────────────────────────────────────
   SIDEBAR TOOLTIP
   ──────────────────────────────────────────── */
function SidebarItem({ label, href, icon, badge, pendingCount }: {
  label: string; href: string; icon: (c: string) => React.ReactNode; badge?: boolean; pendingCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
  const iconColor = active ? "#2563eb" : "#64748b";

  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button
        onClick={() => router.push(href)}
        style={{
          width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "10px", border: "none", cursor: "pointer",
          background: active ? "#eff6ff" : hover ? "#f8fafc" : "transparent",
          transition: "background 0.15s",
          position: "relative",
        }}
      >
        {icon(iconColor)}
        {badge && (pendingCount ?? 0) > 0 && (
          <span style={{
            position: "absolute", top: "6px", right: "6px",
            width: "8px", height: "8px", background: "#ef4444",
            borderRadius: "50%", border: "2px solid white",
          }} />
        )}
      </button>
      {hover && (
        <div style={{
          position: "absolute", left: "54px", top: "50%", transform: "translateY(-50%)",
          background: "#0f172a", color: "white", fontSize: "12px", fontWeight: "500",
          padding: "5px 10px", borderRadius: "6px", whiteSpace: "nowrap", zIndex: 100,
          pointerEvents: "none",
        }}>
          {label}
          {badge && (pendingCount ?? 0) > 0 && (
            <span style={{ marginLeft: "6px", background: "#ef4444", padding: "1px 6px", borderRadius: "10px", fontSize: "10px" }}>{pendingCount}</span>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   PAGE TITLE MAP
   ──────────────────────────────────────────── */
function getPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/listings") return "Listings";
  if (pathname.startsWith("/admin/listings/")) return "Edit Listing";
  if (pathname === "/admin/pending") return "Pending Approval";
  if (pathname === "/admin/reviews") return "Reviews";
  if (pathname === "/admin/categories") return "Categories";
  if (pathname === "/admin/areas") return "Areas";
  if (pathname === "/admin/subscribers") return "Subscribers";
  return "Admin";
}

/* ────────────────────────────────────────────
   MAIN LAYOUT
   ──────────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  // Skip layout on login page
  if (pathname === "/admin/login") return <>{children}</>;

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch notification counts
  useEffect(() => {
    async function fetchCounts() {
      const { count: pListings } = await supabase
        .from("tradespeople")
        .select("*", { count: "exact", head: true })
        .eq("approved", false);
      setPendingCount(pListings ?? 0);
    }
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Ctrl+K handler
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const totalNotifications = pendingCount ?? 0;

  return (
    <ToastContext.Provider value={{ addToast }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .admin-scrollbar::-webkit-scrollbar { width: 6px; }
        .admin-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .admin-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .admin-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", position: "fixed", inset: 0, zIndex: 50, overflow: "hidden" }}>
        {/* ──── SIDEBAR ──── */}
        <aside style={{
          width: "64px", flexShrink: 0,
          background: "white",
          borderRight: "1px solid #e2e8f0",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "16px 0",
          gap: "4px",
        }}>
          {/* Logo */}
          <div
            onClick={() => router.push("/admin")}
            style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: "700", color: "white",
              cursor: "pointer", marginBottom: "16px", flexShrink: 0,
            }}
          >
            CV
          </div>

          {/* Nav items */}
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
              badge={item.badge}
              pendingCount={pendingCount}
            />
          ))}

          <div style={{ flex: 1 }} />

          {/* Settings */}
          <SidebarItem label="Settings" href="/admin" icon={SETTINGS_ICON} />

          {/* Admin avatar */}
          <div
            style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: "600", color: "white",
              marginTop: "8px", cursor: "pointer", flexShrink: 0,
            }}
            title="admin@cvtrades.co.uk"
            onClick={() => router.push("/api/auth/signout")}
          >
            PA
          </div>
        </aside>

        {/* ──── MAIN AREA ──── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Top bar */}
          <header style={{
            height: "56px", flexShrink: 0,
            background: "white", borderBottom: "1px solid #e2e8f0",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 28px",
          }}>
            <h1 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
              {getPageTitle(pathname)}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Search trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px",
                  padding: "7px 14px", cursor: "pointer", color: "#94a3b8", fontSize: "13px",
                  minWidth: "200px",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                Search...
                <kbd style={{ marginLeft: "auto", fontSize: "11px", padding: "2px 6px", background: "white", border: "1px solid #e2e8f0", borderRadius: "4px", color: "#94a3b8" }}>Ctrl K</kbd>
              </button>

              {/* Notification bell */}
              <button
                onClick={() => router.push(pendingCount > 0 ? "/admin/listings" : "/admin/reviews")}
                style={{
                  position: "relative", background: "none", border: "none",
                  cursor: "pointer", padding: "6px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                {totalNotifications > 0 && (
                  <span style={{
                    position: "absolute", top: "2px", right: "2px",
                    minWidth: "16px", height: "16px", background: "#ef4444",
                    borderRadius: "50%", border: "2px solid white",
                    fontSize: "10px", fontWeight: "600", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 3px",
                  }}>{totalNotifications}</span>
                )}
              </button>

              {/* Sign out link */}
              <a
                href="/api/auth/signout"
                style={{
                  fontSize: "12px", color: "#94a3b8", textDecoration: "none",
                  padding: "6px 10px", borderRadius: "6px",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
              >
                Sign out
              </a>
            </div>
          </header>

          {/* Content */}
          <main className="admin-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
            {children}
          </main>
        </div>
      </div>

      {/* Search modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}
