"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/", label: "Accueil" },
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
  const [scrolled, setScrolled] = useState(false);
  const [telephone, setTelephone] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("reglages").select("telephone").limit(1).single().then(({ data }) => {
      if (data?.telephone) setTelephone(data.telephone);
    });
  }, []);

  const phoneLink = telephone ? `tel:${telephone.replace(/\s/g, "")}` : "tel:";
  const phoneFormatted = telephone
    .replace(/\s/g, "")
    .replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 shadow-md backdrop-blur-[14px]"
          : "bg-white/82 backdrop-blur-[14px]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/galerie/logo.jpg"
              alt="A Cas'a Mina"
              width={140}
              height={56}
              className="h-[60px] w-auto lg:h-[70px] rounded-full"
              priority
            />
          </Link>

          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-[15px] font-medium text-texte transition-colors duration-300 hover:text-marine font-body"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={phoneLink}
              className="inline-flex items-center gap-2 rounded-lg bg-marine px-5 py-2.5 text-sm font-semibold text-creme transition-all duration-300 hover:bg-marine-light hover:scale-105 font-body"
            >
              <Phone size={16} />
              <span className="hidden sm:inline">{phoneFormatted}</span>
            </a>

            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-texte hover:bg-marine/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-[14px] border-t border-border"
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-texte transition-colors hover:bg-marine/5 hover:text-marine font-body"
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
