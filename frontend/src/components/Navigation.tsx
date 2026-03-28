"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModeToggle from "./ModeToggle";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#quiz", label: "Quiz" },
    { href: "#careers", label: "Careers" },
    { href: "#tvet", label: "TVET" },
    { href: "#bursaries", label: "Bursaries" },
    { href: "#subjects", label: "Subjects" },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-nav shadow-md" : "bg-white/50 backdrop-blur-0"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/landing-normal"
                className="flex items-center space-x-2 group"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-prospect-blue flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <span className="text-lg md:text-xl font-bold text-white">P</span>
                </div>
                <span className="text-lg font-bold text-prospect-navy hidden sm:block group-hover:text-prospect-blue transition-colors">
                  Prospect
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="px-3 py-2 text-prospect-dark hover:text-prospect-blue transition-colors relative group"
                  >
                    {link.label}
                    <motion.span
                      className="absolute bottom-1 left-0 h-0.5 bg-prospect-blue"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons + Mode Toggle */}
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/signin"
                  className="hidden sm:px-4 sm:py-2 sm:text-prospect-blue sm:font-semibold sm:hover:text-blue-700 sm:transition-colors sm:inline-block border-2 border-prospect-blue rounded-xl"
                >
                  Sign In
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/signup"
                  className="hidden sm:px-6 sm:py-2 sm:bg-prospect-blue sm:text-white sm:rounded-xl sm:font-semibold sm:hover:shadow-lg sm:transition-shadow sm:inline-block"
                >
                  Sign Up
                </Link>
              </motion.div>
              <ModeToggle />
              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <AnimatePresence mode="wait">
                  {menuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm top-16"
            />

            {/* Menu */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-16 z-40 w-64 h-screen bg-white/95 backdrop-blur-md shadow-lg overflow-y-auto"
            >
              <div className="p-4 space-y-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05, type: "spring", stiffness: 200 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-prospect-dark hover:bg-prospect-blue/10 hover:text-prospect-blue rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <Link
                      href="/auth/signin"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-prospect-dark hover:bg-gray-100 rounded-lg border-2 border-prospect-blue font-semibold transition-colors"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
                  >
                    <Link
                      href="/auth/signup"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 bg-prospect-blue text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors text-center"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className="h-16 md:h-20" />
    </>
  );
}
