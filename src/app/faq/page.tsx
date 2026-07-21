"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FAQItem {
  id: string;
  question: string;
  reponse: string;
  ordre: number;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("faq")
      .select("*")
      .order("ordre", { ascending: true })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Questions fréquentes"
          subtitle="Trouvez rapidement les réponses à vos questions"
        />

        {loading ? (
          <div className="text-center py-12 text-texte-light">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-blanc shadow-sm">
            <p className="text-texte-light">Aucune question pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
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
        )}
      </div>
    </div>
  );
}
