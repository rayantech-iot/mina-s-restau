"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
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

const heroConfig = {
  slogan: "TRAITEUR CORSE & FRANÇAIS",
  titleLine1: "A CAS'A",
  titleLine2: "MINA",
  subtitle: "Le goût de l'authentique, le plaisir du partage.",
  description:
    "Cuisine corse et française, faite maison avec des produits de qualité, pour accompagner vos mariages, anniversaires, événements privés et professionnels.",
  image: "/images/galerie/premiere-section-accueil.png",
  ctaPrimary: { label: "Découvrir la carte", href: "/carte" },
  ctaSecondary: { label: "Nos réalisations", href: "/galerie" },
};

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [telephone, setTelephone] = useState("0676772275");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("reglages")
      .select("telephone")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data?.telephone) setTelephone(data.telephone.replace(/\s/g, ""));
      });
  }, []);

  const phoneFormatted = telephone.replace(
    /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
    "$1 $2 $3 $4 $5"
  );

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  });

  return (
    <section className="relative h-screen w-full overflow-hidden bg-creme">
      {/* ===== PHOTO DROITE 60% ===== */}
      <div className="absolute inset-0 lg:left-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-[60%]">
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative h-full w-full"
        >
          <Image
            src={heroConfig.image}
            alt="Plat gastronomique - A Cas'a Mina"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            quality={90}
          />
          {/* Overlay gradient photo */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.88] via-white/[0.35] to-transparent lg:bg-gradient-to-r lg:from-white/[0.88] lg:via-white/[0.15] lg:to-transparent" />
        </motion.div>
      </div>

      {/* ===== NAVIGATION BAR ===== */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 shadow-md backdrop-blur-[14px]"
            : "bg-white/82 backdrop-blur-[14px]"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/galerie/logo.jpg"
                alt="A Cas'a Mina"
                width={140}
                height={56}
                className="h-[80px] w-auto lg:h-[90px] rounded-full"
                priority
              />
            </Link>

            {/* Menu desktop */}
            <div className="hidden lg:flex lg:items-center lg:gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-[15px] font-medium text-texte transition-colors duration-300 hover:text-marine font-body"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Bouton Appeler */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${telephone}`}
                className="inline-flex items-center gap-2 rounded-lg bg-marine px-5 py-2.5 text-sm font-semibold text-creme transition-all duration-300 hover:bg-marine-light hover:scale-105 font-body"
              >
                <Phone size={16} />
                <span className="hidden sm:inline">{phoneFormatted}</span>
              </a>

              {/* Hamburger mobile */}
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

        {/* Menu mobile */}
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
      </motion.nav>

      {/* ===== CONTENU GAUCHE 40% ===== */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Texte - 5 colonnes sur desktop */}
            <div className="lg:col-span-5 lg:col-start-1 pt-20 lg:pt-0">
              <motion.p
                {...fade(0.3)}
                className="text-xs font-semibold tracking-[0.25em] text-dore mb-6 uppercase font-body"
              >
                {heroConfig.slogan}
              </motion.p>

              <motion.h1
                {...fade(0.5)}
                className="font-serif text-[60px] leading-[0.95] font-bold text-marine sm:text-[72px] lg:text-[88px] xl:text-[100px] mb-6"
              >
                {heroConfig.titleLine1}
                <br />
                {heroConfig.titleLine2}
              </motion.h1>

              <motion.p
                {...fade(0.7)}
                className="font-serif italic text-dore text-2xl sm:text-3xl lg:text-[34px] leading-snug mb-6 max-w-[500px]"
              >
                {heroConfig.subtitle}
              </motion.p>

              <motion.p
                {...fade(0.85)}
                className="text-texte-light text-base sm:text-lg leading-[1.7] mb-10 max-w-[520px] font-body"
              >
                {heroConfig.description}
              </motion.p>

              <motion.div
                {...fade(1.0)}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href={heroConfig.ctaPrimary.href}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-lg bg-marine px-7 py-4 text-sm font-semibold text-creme transition-all duration-300 hover:bg-marine-light hover:scale-[1.02] font-body"
                >
                  {heroConfig.ctaPrimary.label}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href={heroConfig.ctaSecondary.href}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-lg border-2 border-marine px-7 py-4 text-sm font-semibold text-marine transition-all duration-300 hover:bg-marine hover:text-creme font-body"
                >
                  {heroConfig.ctaSecondary.label}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
