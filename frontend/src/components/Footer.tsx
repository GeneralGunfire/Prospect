"use client";

import Link from "next/link";
import { Mail, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const sections = [
    {
      title: "Prospect",
      links: [
        { name: "Home", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Universities", href: "#" },
        { name: "TVET Colleges", href: "#" },
      ],
    },
    {
      title: "Tools",
      links: [
        { name: "Career Quiz", href: "#" },
        { name: "Subject Selector", href: "#" },
        { name: "Salary Calc", href: "#" },
        { name: "Study Guide", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "#" },
        { name: "FAQ", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Feedback", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
        { name: "Disclaimer", href: "#" },
        { name: "Cookies", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-prospect-navy text-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-5 gap-8 mb-12"
        >
          {/* Logo Section */}
          <motion.div variants={item}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-prospect-blue flex items-center justify-center">
                <span className="text-lg font-bold text-white">P</span>
              </div>
              <span className="text-lg font-semibold">Prospect</span>
            </div>
            <p className="text-gray-400 text-sm">
              Free career guidance for South African high school students.
            </p>
          </motion.div>

          {/* Links Sections */}
          {sections.map((section) => (
            <motion.div key={section.title} variants={item}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            {/* Copyright */}
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 Prospect. All rights reserved. | Free for South African students.
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.2, y: -3 }}
                href="mailto:info@prospect.co.za"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, y: -3 }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, y: -3 }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
