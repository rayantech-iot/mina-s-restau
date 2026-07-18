"use client";

import { useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/FadeIn";
import { Phone, MessageCircle, Send, CheckCircle } from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Contact"
          subtitle="Une question, une commande ? N'hésitez pas à nous contacter"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coordonnées */}
          <FadeIn>
            <div className="space-y-6">
              <div className="rounded-2xl bg-blanc p-6 shadow-md">
                <h3 className="font-serif text-xl font-bold text-marine mb-4">
                  Contactez-nous directement
                </h3>
                <div className="space-y-4">
                  <a
                    href="tel:"
                    className="flex items-center gap-4 rounded-xl bg-creme p-4 transition-all hover:bg-marine/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-marine text-creme">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-marine">Téléphone</p>
                      <p className="text-sm text-texte-light">—</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl bg-creme p-4 transition-all hover:bg-marine/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-creme">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-marine">WhatsApp</p>
                      <p className="text-sm text-texte-light">
                        Envoyez-nous un message
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://instagram.com/acas_a_mina"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl bg-creme p-4 transition-all hover:bg-marine/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-creme">
                      <InstagramIcon size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-marine">Instagram</p>
                      <p className="text-sm text-texte-light">@acas_a_mina</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Formulaire */}
          <FadeIn delay={0.1}>
            <div className="rounded-2xl bg-blanc p-6 shadow-md">
              <h3 className="font-serif text-xl font-bold text-marine mb-4">
                Envoyez-nous un message
              </h3>

              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="mx-auto text-success mb-4" />
                  <h4 className="font-serif text-xl font-bold text-marine">
                    Message envoyé !
                  </h4>
                  <p className="mt-2 text-texte-light">
                    Nous vous répondrons très rapidement.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-texte mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-texte mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-marine px-8 py-3.5 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
                  >
                    <Send size={18} />
                    Envoyer
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
