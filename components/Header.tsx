import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-100 bg-white/70 backdrop-blur">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-white shadow-soft">
            CV
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            CV <span className="font-semibold">Trades</span>
            <span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <Link href="/" className="transition hover:text-slate-900 hover:underline hover:underline-offset-4">
            Home
          </Link>
          <Link href="/about" className="transition hover:text-slate-900 hover:underline hover:underline-offset-4">
            About
          </Link>
          <Link href="/faq" className="transition hover:text-slate-900 hover:underline hover:underline-offset-4">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/advertise" className="btn-primary text-sm">
            Join Directory
          </Link>
        </div>
      </div>
    </header>
  );
}
