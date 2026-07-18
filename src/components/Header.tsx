"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/carte", label: "La Carte" },
  { href: "/a-propos", label: "À propos" },
  { href: "/infos-pratiques", label: "Infos pratiques" },
  { href: "/evenements", label: "Événements" },
  { href: "/galerie", label: "Galerie" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-marine shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.svg"
              alt="A Cas'a Mina"
              width={140}
              height={48}
              className="h-10 w-auto sm:h-12"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-creme/80 transition-colors hover:text-dore rounded-md hover:bg-marine-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Appeler + mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="tel:"
              className="inline-flex items-center gap-2 rounded-full bg-dore px-4 py-2 text-sm font-semibold text-marine transition-all hover:bg-dore-light hover:scale-105"
            >
              <Phone size={16} />
              <span className="hidden sm:inline">Appeler</span>
            </a>

            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-creme hover:bg-marine-light"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-marine-light border-t border-creme/10"
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-medium text-creme/80 transition-colors hover:bg-marine hover:text-creme"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
