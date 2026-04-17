import { Twitter, Linkedin, Instagram } from 'lucide-react';

export function NeoMinimalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">

        {/* Top: brand + links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 pb-10 border-b border-slate-800">

          {/* Brand — takes 2 columns on desktop */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white font-black text-base">P</span>
              </div>
              <span className="text-white font-black tracking-widest uppercase text-sm" style={{ letterSpacing: '0.18em' }}>
                Prospect
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[18rem]">
              Helping South African students navigate careers, bursaries, and their future — one smart decision at a time.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-5">
              {[
                { href: '#', label: 'Twitter',   Icon: Twitter },
                { href: '#', label: 'LinkedIn',  Icon: Linkedin },
                { href: '#', label: 'Instagram', Icon: Instagram },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-4">Features</h4>
            <ul className="space-y-2.5">
              {['Quiz', 'Careers', 'Study Library', 'TVET Path'].map(l => (
                <li key={l}>
                  <a href="#" className="text-xs text-slate-500 hover:text-slate-200 transition-colors duration-150">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {['Bursaries', 'Job Map', 'Study Calendar', 'Subject Selector'].map(l => (
                <li key={l}>
                  <a href="#" className="text-xs text-slate-500 hover:text-slate-200 transition-colors duration-150">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Use', 'Contact Us'].map(l => (
                <li key={l}>
                  <a href="#" className="text-xs text-slate-500 hover:text-slate-200 transition-colors duration-150">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-8">
          <p className="text-[11px] text-slate-600">
            &copy; {year} Prospect SA. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-700">
            Built for South African learners
          </p>
        </div>
      </div>
    </footer>
  );
}
