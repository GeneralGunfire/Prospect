'use client';

import React from 'react';
import { Github, Twitter, Linkedin, ArrowRight, BookOpen } from 'lucide-react';

export function NeoMinimalFooter() {
  return (
    <footer className="w-full bg-[#1B2250] border-t border-white/10 flex flex-wrap pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <BookOpen className="text-[#3B5A7F] fill-[#3B5A7F]/10" size={24} />
              <h2 className="text-2xl font-bold tracking-tighter text-white">PROSPECT</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Free career guidance for South African high school students. Discover your path,
              find bursaries, and plan your future — no login required.
            </p>
            <div className="flex items-center gap-2 mt-2 group">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="email"
                  placeholder="Stay updated..."
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#3B5A7F]/70 transition-colors"
                />
              </div>
              <button className="p-2.5 bg-[#176293] rounded-lg text-white hover:bg-[#1A3E6F] transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {[
            {
              title: "Guidance",
              links: [
                { label: "Take the Quiz", href: "#quiz" },
                { label: "Explore Careers", href: "#careers" },
                { label: "TVET Paths", href: "#tvet" },
                { label: "Bursaries", href: "#bursaries" },
              ],
            },
            {
              title: "Learning",
              links: [
                { label: "Study Library", href: "#library" },
                { label: "Job Map", href: "#map" },
                { label: "Calendar", href: "#calendar" },
                { label: "Dashboard", href: "#dashboard" },
              ],
            },
            {
              title: "Connect",
              links: [
                { label: "About Us", href: "#about" },
                { label: "Contact", href: "#contact" },
                { label: "Privacy Policy", href: "#privacy" },
                { label: "Terms of Use", href: "#terms" },
              ],
            },
          ].map((section, idx) => (
            <div key={idx} className="col-span-6 md:col-span-2 flex flex-col gap-4">
              <h4 className="text-xs font-mono font-semibold text-white/50 uppercase tracking-widest">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-mono text-white/40 hover:text-[#3B5A7F] transition-colors flex items-center gap-2 group w-fit"
                    >
                      <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-[#3B5A7F] transition-all group-hover:w-4 duration-200" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <p className="text-xs text-white/30 font-mono">
            © {new Date().getFullYear()} Prospect SA. Free for all South African students.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex gap-4 border-r border-white/10 pr-6 mr-2">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-white/30 hover:text-white transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] uppercase font-medium text-green-500/80 tracking-wider">
                Free & Always Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
