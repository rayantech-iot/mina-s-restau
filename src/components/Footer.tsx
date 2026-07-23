import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock } from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";

export default function Footer() {
  return (
    <footer className="bg-marine text-creme/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Image
              src="/images/galerie/logo.jpg"
              alt="A Cas'a Mina"
              width={160}
              height={56}
              className="h-14 w-auto mb-4 rounded"
            />
            <p className="text-sm leading-relaxed text-creme/75">
              Restaurant à emporter en Corse. Poulets rôtis à la broche et plats
              faits maison, préparés avec amour entre Porto-Vecchio et Pinarello.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-creme mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/carte", label: "La Carte" },
                { href: "/a-propos", label: "À propos" },
                { href: "/evenements", label: "Événements & Devis" },
                { href: "/galerie", label: "Galerie" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-dore"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-creme mb-4">
              Nous trouver
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://maps.app.goo.gl/qgCZXYrSYWUUJPp3A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm hover:text-dore transition-colors"
                >
                  <MapPin size={18} className="mt-0.5 flex-shrink-0 text-dore" />
                  <span>
                    Route de Cirindinu
                    <br />
                    20144 Sainte-Lucie-de-Porto-Vecchio
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={18} className="flex-shrink-0 text-dore" />
                <a href="tel:+33676772275" className="hover:text-dore transition-colors">
                  06 76 77 22 75
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock size={18} className="mt-0.5 flex-shrink-0 text-dore" />
                <span>Horaires à consulter sur la page Infos pratiques</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-creme mb-4">
              Suivez-nous
            </h3>
            <a
              href="https://instagram.com/acas_a_mina"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-creme/10 px-4 py-2 text-sm font-medium text-creme transition-colors hover:bg-dore hover:text-marine"
            >
              <InstagramIcon size={18} />
              @acas_a_mina
            </a>
            <p className="mt-6 text-xs text-creme/55">
              Route de Cirindinu, Sainte-Lucie-de-Porto-Vecchio
              <br />
              Entre Porto-Vecchio et Pinarello
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-creme/10 pt-8 text-center text-xs text-creme/55">
          <p>
            &copy; {new Date().getFullYear()} A Cas&apos;a Mina — Tous droits
            réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
