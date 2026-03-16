import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="container-page py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary text-xs font-semibold text-white">
                CV
              </div>
              <span className="text-base font-semibold tracking-tight text-white">
                CV Trades<span className="text-primary">.</span>
              </span>
            </div>
            <p className="text-sm text-slate-400">
              The modern directory for finding trusted, local tradespeople in
              Coventry, Warwickshire, and surrounding CV postcode areas.
            </p>
          </div>

          <div className="flex flex-wrap gap-16 text-sm md:justify-end">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">Find a Trade</Link>
                </li>
                <li>
                  <Link href="/advertise" className="hover:text-white transition-colors">Join as a Professional</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CV Trades Directory. All rights reserved.</p>
          <p>Built for the CV Postcode.</p>
        </div>
      </div>
    </footer>
  );
}
