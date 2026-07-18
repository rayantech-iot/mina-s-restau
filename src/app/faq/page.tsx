"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "Peut-on commander à l'avance ?",
    reponse:
      "Oui, vous pouvez passer commande par téléphone à l'avance. Nous vous recommandons cependant de le faire le plus tôt possible, especially pour les grandes quantités ou les commandes spéciales.",
  },
  {
    question: "Le poulet à la broche est-il disponible tous les jours ?",
    reponse:
      "Non, le poulet à la broche n'est pas toujours disponible. Consultez notre page Infos pratiques ou notre bandeau d'accueil pour connaître la disponibilité du jour.",
  },
  {
    question: "Proposez-vous des commandes groupées pour un événement ?",
    reponse:
      "Oui ! Nous proposons des formules sur mesure pour les mariages, anniversaires, réunions de famille ou d'entreprise. Rendez-vous sur notre page Événements pour faire une demande de devis.",
  },
  {
    question: "Est-ce uniquement à emporter, ou existe-t-il une livraison ?",
    reponse:
      "A Cas'a Mina est un restaurant à emporter uniquement. Vous passez votre commande et récupérez vos plats sur place.",
  },
  {
    question: "Quels moyens de paiement sont acceptés ?",
    reponse:
      "Nous acceptons les paiements en espèces et par carte bancaire.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Questions fréquentes"
          subtitle="Trouvez rapidement les réponses à vos questions"
        />

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-blanc shadow-sm overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-serif text-lg font-semibold text-marine pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-dore transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-texte-light leading-relaxed border-t border-border-light pt-4">
                      {item.reponse}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
