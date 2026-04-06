import React, { useState } from 'react';

interface NavItem {
  name: string;
  href: string;
}

interface NavMenuProps {
  items?: NavItem[];
  onNavigate?: (href: string) => void;
  activePath?: string;
}

const defaultItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Quiz', href: '/quiz' },
  { name: 'Careers', href: '/careers' },
  { name: 'TVET', href: '/tvet' },
  { name: 'Library', href: '/library' },
  { name: 'Bursaries', href: '/bursaries' },
  { name: 'Map', href: '/map' },
  { name: 'Calendar', href: '/calendar' },
];

export default function NavMenu({ items = defaultItems, onNavigate, activePath }: NavMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    onNavigate?.(href);
  };

  return (
    <nav className="relative bg-white w-full">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden absolute top-4 right-4 z-20 p-2"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        data-mobile-menu
      >
        <div className={`w-6 h-0.5 bg-slate-700 mb-1.5 transition-transform duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`} />
        <div className={`w-6 h-0.5 bg-slate-700 mb-1.5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
        <div className={`w-6 h-0.5 bg-slate-700 transition-transform duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`} />
      </button>

      <div className={`
        flex items-center justify-center w-full py-2
        md:block
        ${isMenuOpen ? 'block' : 'hidden md:block'}
      `}>
        <ul className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-1 md:justify-center">
          {items.map((item) => {
            const isActive = activePath === item.href;
            return (
              <li key={item.name} className="list-none">
                <a
                  href={item.href}
                  className="relative inline-block group"
                  onClick={(e) => handleClick(e, item.href)}
                >
                  <span className={`
                    relative z-10 block uppercase font-semibold transition-colors duration-300
                    group-hover:text-white
                    text-lg py-2 px-3 md:text-sm md:py-2 md:px-3
                    ${isActive ? 'text-white' : 'text-slate-700'}
                  `}>
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="absolute top-[2px] left-0 w-full h-full bg-[#176293]" />
                  )}
                  {!isActive && (
                    <>
                      <span className="absolute inset-0 border-t-2 border-b-2 border-[#176293] transform scale-y-[2] opacity-0 transition-all duration-300 origin-center group-hover:scale-y-100 group-hover:opacity-100" />
                      <span className="absolute top-[2px] left-0 w-full h-full bg-[#176293] transform scale-0 opacity-0 transition-all duration-300 origin-top group-hover:scale-100 group-hover:opacity-100" />
                    </>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
