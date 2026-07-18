import { createClient } from "@/lib/supabase/server";
import { Calendar, MessageSquare, UtensilsCrossed, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: platsCount } = await supabase
    .from("plats")
    .select("*", { count: "exact", head: true });

  const { count: demandesCount } = await supabase
    .from("demandes_devis")
    .select("*", { count: "exact", head: true })
    .eq("statut", "nouveau");

  const { count: messagesCount } = await supabase
    .from("messages_contact")
    .select("*", { count: "exact", head: true })
    .eq("statut", "nouveau");

  const today = new Date().toISOString().split("T")[0];
  const { data: todayDispo } = await supabase
    .from("disponibilites")
    .select("*")
    .eq("date", today)
    .single();

  const stats = [
    {
      label: "Plats en ligne",
      value: platsCount ?? 0,
      icon: UtensilsCrossed,
      color: "bg-marine",
      href: "/admin/plats",
    },
    {
      label: "Nouvelles demandes devis",
      value: demandesCount ?? 0,
      icon: TrendingUp,
      color: "bg-dore",
      href: "/admin/demandes",
    },
    {
      label: "Nouveaux messages",
      value: messagesCount ?? 0,
      icon: MessageSquare,
      color: "bg-success",
      href: "/admin/demandes",
    },
    {
      label: "Statut aujourd'hui",
      value: todayDispo?.statut_ouverture === "ouvert" ? "Ouvert" : "Non défini",
      icon: Calendar,
      color: "bg-marine-light",
      href: "/admin/calendrier",
      isText: true,
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-marine mb-8">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl bg-blanc p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-texte-light">{stat.label}</p>
                <p className="mt-2 font-serif text-2xl font-bold text-marine">
                  {stat.isText ? (
                    <span className="text-lg">{stat.value}</span>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color} text-creme`}
              >
                <stat.icon size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions rapides */}
        <div className="rounded-2xl bg-blanc p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-marine mb-4">
            Actions rapides
          </h2>
          <div className="space-y-2">
            <Link
              href="/admin/plats/new"
              className="flex items-center gap-3 rounded-xl bg-creme p-3 text-sm font-medium text-marine transition-all hover:bg-marine/5"
            >
              <UtensilsCrossed size={18} className="text-dore" />
              Ajouter un plat
            </Link>
            <Link
              href="/admin/calendrier"
              className="flex items-center gap-3 rounded-xl bg-creme p-3 text-sm font-medium text-marine transition-all hover:bg-marine/5"
            >
              <Calendar size={18} className="text-dore" />
              Mettre à jour le calendrier
            </Link>
            <Link
              href="/admin/demandes"
              className="flex items-center gap-3 rounded-xl bg-creme p-3 text-sm font-medium text-marine transition-all hover:bg-marine/5"
            >
              <MessageSquare size={18} className="text-dore" />
              Voir les demandes
            </Link>
          </div>
        </div>

        {/* Aperçu site public */}
        <div className="rounded-2xl bg-blanc p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-marine mb-4">
            Voir le site public
          </h2>
          <p className="text-sm text-texte-light mb-4">
            Vérifiez l&apos;apparence de votre site en temps réel.
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-marine px-6 py-2.5 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
          >
            Ouvrir le site
          </a>
        </div>
      </div>
    </div>
  );
}
