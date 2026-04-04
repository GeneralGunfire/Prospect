export function NeoMinimalFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        {/* Logo and tagline */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-base">P</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white">Prospect</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400">Know your path. Own your future.</p>
        </div>

        {/* Links Grid - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 border-t border-slate-800 pt-8">
          {/* Column 1 - Features */}
          <div className="col-span-1">
            <h4 className="font-semibold text-white text-sm md:text-base mb-3 md:mb-4">Features</h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><a href="/quiz" className="text-slate-400 hover:text-white transition-colors">Quiz</a></li>
              <li><a href="/careers" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="/study-library" className="text-slate-400 hover:text-white transition-colors">Study</a></li>
            </ul>
          </div>

          {/* Column 2 - Resources */}
          <div className="col-span-1">
            <h4 className="font-semibold text-white text-sm md:text-base mb-3 md:mb-4">Resources</h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><a href="/tvet-path" className="text-slate-400 hover:text-white transition-colors">TVET</a></li>
              <li><a href="/bursaries" className="text-slate-400 hover:text-white transition-colors">Bursaries</a></li>
              <li><a href="/job-map" className="text-slate-400 hover:text-white transition-colors">Jobs</a></li>
            </ul>
          </div>

          {/* Column 3 - Tools */}
          <div className="col-span-1">
            <h4 className="font-semibold text-white text-sm md:text-base mb-3 md:mb-4">Tools</h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><a href="/calendar" className="text-slate-400 hover:text-white transition-colors">Calendar</a></li>
              <li><a href="/subject-selector" className="text-slate-400 hover:text-white transition-colors">Subjects</a></li>
              <li><a href="/map" className="text-slate-400 hover:text-white transition-colors">Map</a></li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div className="col-span-1">
            <h4 className="font-semibold text-white text-sm md:text-base mb-3 md:mb-4">Legal</h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><a href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms</a></li>
              <li><a href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-xs md:text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Prospect SA. All rights reserved.
            </p>
            <div className="flex gap-4 md:gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-xs md:text-sm font-medium">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-xs md:text-sm font-medium">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-xs md:text-sm font-medium">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
