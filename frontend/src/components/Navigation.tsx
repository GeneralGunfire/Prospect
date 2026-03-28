"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ModeToggle from "./ModeToggle";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/landing-normal" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-prospect-blue flex items-center justify-center">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <span className="text-lg font-semibold text-prospect-navy hidden sm:block">
              Prospect
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#home" className="text-prospect-dark hover:text-prospect-blue transition-colors">
              Home
            </Link>
            <Link href="#quiz" className="text-prospect-dark hover:text-prospect-blue transition-colors">
              Quiz
            </Link>
            <Link href="#careers" className="text-prospect-dark hover:text-prospect-blue transition-colors">
              Careers
            </Link>
            <Link href="#tvet" className="text-prospect-dark hover:text-prospect-blue transition-colors">
              TVET
            </Link>
            <Link href="#bursaries" className="text-prospect-dark hover:text-prospect-blue transition-colors">
              Bursaries
            </Link>
            <Link href="#subjects" className="text-prospect-dark hover:text-prospect-blue transition-colors">
              Subject Selector
            </Link>
          </div>

          {/* CTA Button + Mode Toggle */}
          <div className="flex items-center space-x-4">
            <button className="hidden sm:px-6 sm:py-2 sm:bg-prospect-blue sm:text-white sm:rounded-lg sm:font-semibold sm:hover:bg-blue-700 sm:transition-colors sm:inline-block">
              Start Quiz
            </button>
            <ModeToggle />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="#home" className="block px-4 py-2 text-prospect-dark hover:bg-gray-100 rounded">
              Home
            </Link>
            <Link href="#quiz" className="block px-4 py-2 text-prospect-dark hover:bg-gray-100 rounded">
              Quiz
            </Link>
            <Link href="#careers" className="block px-4 py-2 text-prospect-dark hover:bg-gray-100 rounded">
              Careers
            </Link>
            <Link href="#tvet" className="block px-4 py-2 text-prospect-dark hover:bg-gray-100 rounded">
              TVET
            </Link>
            <Link href="#bursaries" className="block px-4 py-2 text-prospect-dark hover:bg-gray-100 rounded">
              Bursaries
            </Link>
            <Link href="#subjects" className="block px-4 py-2 text-prospect-dark hover:bg-gray-100 rounded">
              Subject Selector
            </Link>
            <button className="w-full m-4 px-6 py-2 bg-prospect-blue text-white rounded-lg font-semibold hover:bg-blue-700">
              Start Quiz
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
