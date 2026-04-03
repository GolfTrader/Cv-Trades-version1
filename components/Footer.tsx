import { NewsletterBanner } from "@/components/NewsletterBanner";

export function Footer() {
  return (
    <footer>
      {/* Newsletter band - same dark bg, flows seamlessly into footer */}
      <NewsletterBanner />

      {/* Divider line - connects newsletter to footer visually */}
      <div className="bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="border-t border-white/[0.06]" />
        </div>
      </div>

      {/* Footer content */}
      <div className="bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

            {/* Brand */}
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-black text-white bg-blue-600">
                  CV
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Trades<span className="text-blue-400">.</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                The modern directory for finding trusted, local tradespeople in Coventry, Warwickshire, and surrounding CV postcode areas.
              </p>
            </div>

            {/* Link columns */}
            <div className="flex flex-wrap gap-12 sm:gap-16 text-sm md:justify-end">
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-600">Quick Links</h3>
                <ul className="space-y-2.5">
                  <li><a href="/" className="text-slate-400 hover:text-white transition-colors">Home</a></li>
                  <li><a href="/find-a-trade" className="text-slate-400 hover:text-white transition-colors">Find a Trade</a></li>
                  <li><a href="/about" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="/newsletter" className="text-slate-400 hover:text-white transition-colors">Newsletter</a></li>
                  <li><a href="/advertise" className="text-slate-400 hover:text-white transition-colors">Tradesperson Signup</a></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-600">Help</h3>
                <ul className="space-y-2.5">
                  <li><a href="/faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/building-control" className="text-slate-400 hover:text-white transition-colors">Building Control</a></li>
                  <li><a href="/planning-application" className="text-slate-400 hover:text-white transition-colors">Planning Application</a></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-600">Legal</h3>
                <ul className="space-y-2.5">
                  <li><a href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/cookies" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 CV Trades Directory. All rights reserved.</p>
            <p>Coventry &amp; Warwickshire, UK</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
