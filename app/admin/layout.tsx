"use client";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    group: "Directory",
    items: [
      { label: "Tradespeople", href: "/admin/listings" },
      { label: "Categories", href: "/admin/categories" },
      { label: "Areas", href: "/admin/areas" },
    ],
  },
  {
    group: "Moderation",
    items: [
      { label: "Pending Approval", href: "/admin/pending" },
      { label: "Reviews", href: "/admin/reviews" },
    ],
  },
  {
    group: "Marketing",
    items: [{ label: "Newsletter", href: "/admin/subscribers" }],
  },
];

function NavItem({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
  return (
    <button
      onClick={() => router.push(href)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "7px 12px",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: active ? "500" : "400",
        color: active ? "#f8fafc" : "#94a3b8",
        background: active ? "#1e293b" : "transparent",
        border: "none",
        cursor: "pointer",
        marginBottom: "1px",
      }}
    >
      {label}
    </button>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", position: "fixed", inset: 0, zIndex: 50, overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        flexShrink: 0,
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        padding: "20px 12px",
        overflowY: "auto",
      }}>
        <div style={{ padding: "0 8px 24px", borderBottom: "1px solid #1e293b", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "6px",
              background: "#2563eb", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "white",
            }}>CV</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#f1f5f9" }}>Trades Admin</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Dashboard</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {NAV.map((section) => (
            <div key={section.group} style={{ marginBottom: "20px" }}>
              <div style={{
                fontSize: "10px", fontWeight: "600", color: "#475569",
                textTransform: "uppercase", letterSpacing: "0.08em",
                padding: "0 12px", marginBottom: "6px",
              }}>
                {section.group}
              </div>
              {section.items.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "16px" }}>
          <div style={{ fontSize: "11px", color: "#475569", padding: "0 12px", marginBottom: "4px" }}>
            admin@cvtrades.co.uk
          </div>
          <a href="/api/auth/signout" style={{
            display: "block", padding: "7px 12px", borderRadius: "6px",
            fontSize: "13px", color: "#ef4444", textDecoration: "none",
          }}>
            Sign out
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
        {children}
      </main>
    </div>
  );
}
