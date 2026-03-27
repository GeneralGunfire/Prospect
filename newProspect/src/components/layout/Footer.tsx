import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white pt-8 pb-4 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4 group cursor-pointer">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-navy font-semibold text-lg shadow-lg">P</div>
            <div className="text-sm font-semibold tracking-tight text-white uppercase font-headline">
              Prospect
            </div>
          </Link>
          <p className="text-white/40 text-[10px] leading-relaxed mb-4 font-normal max-w-xs">
            Empowering South African students to navigate their career path with data-driven insights and verified opportunities.
          </p>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-colors group">
                <Icon className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[8px] font-bold uppercase tracking-[0.2em] text-secondary mb-4">Platform</h4>
          <ul className="space-y-2">
            {['Quiz', 'Careers', 'Bursaries', 'APS Calculator', 'Subject Selector'].map((item) => (
              <li key={item}>
                <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-white/40 hover:text-white text-[10px] transition-colors font-medium">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[8px] font-bold uppercase tracking-[0.2em] text-secondary mb-4">Resources</h4>
          <ul className="space-y-2">
            {['Study Library', 'NSFAS Eligibility', 'University Guide', 'TVET Colleges', 'Career Insights'].map((item) => (
              <li key={item}>
                <a href="#" className="text-white/40 hover:text-white text-[10px] transition-colors font-medium">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[8px] font-bold uppercase tracking-[0.2em] text-secondary mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span className="text-white/40 text-[10px] leading-relaxed font-medium">123 Innovation Way, Cape Town, SA</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-secondary shrink-0" />
              <a href="mailto:hello@prospectsa.co.za" className="text-white/40 hover:text-white text-[10px] transition-colors font-medium">hello@prospectsa.co.za</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span className="text-white/40 text-[10px] font-medium">+27 (0) 21 555 0123</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-white/20 text-[8px] font-medium uppercase tracking-widest">
          © {currentYear} Prospect SA.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-white/20 hover:text-white text-[8px] font-medium uppercase tracking-widest transition-colors">Privacy Policy</a>
          <a href="#" className="text-white/20 hover:text-white text-[8px] font-medium uppercase tracking-widest transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
