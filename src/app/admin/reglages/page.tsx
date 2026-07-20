"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Mail } from "lucide-react";

const defaultHoraires: Record<string, { ouverture: string; fermeture: string } | null> = {
  lundi: { ouverture: "11:30", fermeture: "14:00" },
  mardi: { ouverture: "11:30", fermeture: "14:00" },
  mercredi: null,
  jeudi: { ouverture: "11:30", fermeture: "14:00" },
  vendredi: { ouverture: "11:30", fermeture: "14:00" },
  samedi: { ouverture: "11:30", fermeture: "14:00" },
  dimanche: null,
};

export default function AdminReglagesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [telephone, setTelephone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [adresse, setAdresse] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [texteAPropos, setTexteAPropos] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [horaires, setHoraires] = useState(defaultHoraires);

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifEmail, setNotifEmail] = useState("");
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");

  useEffect(() => {
    loadReglages();
  }, []);

  const loadReglages = async () => {
    const { data } = await supabase.from("reglages").select("*").limit(1).single();
    if (data) {
      setTelephone(data.telephone || "");
      setWhatsapp(data.whatsapp || "");
      setAdresse(data.adresse || "");
      setGoogleMapsUrl(data.google_maps_url || "");
      setTexteAPropos(data.texte_a_propos || "");
      setInstagram(data.reseaux_sociaux?.instagram || "");
      setFacebook(data.reseaux_sociaux?.facebook || "");
      if (data.horaires) setHoraires(data.horaires);
      if (data.email_notification) {
        setNotifEnabled(data.email_notification.enabled || false);
        setNotifEmail(data.email_notification.email || "");
        setSmtpHost(data.email_notification.smtp_host || "smtp.gmail.com");
        setSmtpPort(data.email_notification.smtp_port || "587");
        setSmtpUser(data.email_notification.smtp_user || "");
        setSmtpPass(data.email_notification.smtp_pass || "");
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaved(false);
    const { data: existing } = await supabase.from("reglages").select("id").limit(1).single();

    const payload = {
      telephone,
      whatsapp,
      adresse,
      google_maps_url: googleMapsUrl,
      texte_a_propos: texteAPropos,
      horaires,
      reseaux_sociaux: { instagram, facebook },
      email_notification: {
        enabled: notifEnabled,
        email: notifEmail,
        smtp_host: smtpHost,
        smtp_port: parseInt(smtpPort),
        smtp_user: smtpUser,
        smtp_pass: smtpPass,
      },
    };

    if (existing) {
      await supabase.from("reglages").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("reglages").insert(payload);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateHoraire = (jour: string, field: "ouverture" | "fermeture", value: string) => {
    setHoraires((prev) => ({
      ...prev,
      [jour]: prev[jour]
        ? { ...prev[jour]!, [field]: value }
        : { ouverture: "11:30", fermeture: "14:00", [field]: value },
    }));
  };

  const toggleJour = (jour: string) => {
    setHoraires((prev) => ({
      ...prev,
      [jour]: prev[jour] ? null : { ouverture: "11:30", fermeture: "14:00" },
    }));
  };

  if (loading) {
    return <div className="text-center py-12 text-texte-light">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-marine">Réglages</h1>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-marine px-5 py-2.5 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
        >
          <Save size={18} />
          Sauvegarder
        </button>
      </div>

      {saved && (
        <div className="mb-6 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
          Réglages sauvegardés avec succès !
        </div>
      )}

      <div className="space-y-8">
        <div className="rounded-2xl bg-blanc p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-marine mb-4">Coordonnées</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-texte mb-1">Téléphone</label>
              <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)}
                className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                placeholder="06 76 77 22 75" />
            </div>
            <div>
              <label className="block text-sm font-medium text-texte mb-1">WhatsApp</label>
              <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                placeholder="33 6 76 77 22 75" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-blanc p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-marine mb-4">Adresse & localisation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-texte mb-1">Adresse complète</label>
              <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)}
                className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                placeholder="Route de Cirendino, 20144 Sainte-Lucie de Porto-Vecchio" />
            </div>
            <div>
              <label className="block text-sm font-medium text-texte mb-1">Lien Google Maps</label>
              <input type="url" value={googleMapsUrl} onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                placeholder="https://maps.google.com/..." />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-blanc p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-marine mb-4">Horaires d&apos;ouverture</h2>
          <div className="space-y-3">
            {Object.entries(horaires).map(([jour, h]) => (
              <div key={jour} className="flex items-center gap-4 rounded-lg bg-creme px-4 py-3">
                <label className="flex items-center gap-3 min-w-[120px]">
                  <button type="button" onClick={() => toggleJour(jour)}
                    className={`h-5 w-9 rounded-full transition-colors ${h ? "bg-success" : "bg-border"}`}>
                    <span className={`block h-4 w-4 rounded-full bg-blanc shadow transition-transform ${h ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                  <span className="capitalize text-sm font-medium text-texte">{jour}</span>
                </label>
                {h && (
                  <div className="flex items-center gap-2 text-sm">
                    <input type="time" value={h.ouverture}
                      onChange={(e) => updateHoraire(jour, "ouverture", e.target.value)}
                      className="rounded border border-border bg-blanc px-2 py-1 text-sm text-texte focus:border-marine outline-none" />
                    <span className="text-texte-lighter">—</span>
                    <input type="time" value={h.fermeture}
                      onChange={(e) => updateHoraire(jour, "fermeture", e.target.value)}
                      className="rounded border border-border bg-blanc px-2 py-1 text-sm text-texte focus:border-marine outline-none" />
                  </div>
                )}
                {!h && <span className="text-sm text-error font-medium">Fermé</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-blanc p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-marine mb-4">Réseaux sociaux</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-texte mb-1">Lien Instagram</label>
              <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                placeholder="https://instagram.com/acas_a_mina" />
            </div>
            <div>
              <label className="block text-sm font-medium text-texte mb-1">Lien Facebook</label>
              <input type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)}
                className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                placeholder="https://facebook.com/..." />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-blanc p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-marine mb-4">Texte &ldquo;À propos&rdquo;</h2>
          <textarea rows={6} value={texteAPropos} onChange={(e) => setTexteAPropos(e.target.value)}
            className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all resize-none"
            placeholder="Présentez votre restaurant, votre histoire, votre philosophie..." />
        </div>

        {/* Notifications email devis */}
        <div className="rounded-2xl bg-blanc p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-marine mb-2 flex items-center gap-2">
            <Mail size={20} className="text-dore" />
            Notifications email (Devis)
          </h2>
          <p className="text-sm text-texte-light mb-4">
            Recevez un email à chaque nouvelle demande de devis. Configurez vos identifiants SMTP ci-dessous.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNotifEnabled(!notifEnabled)}
                className={`h-5 w-9 rounded-full transition-colors ${notifEnabled ? "bg-success" : "bg-border"}`}
              >
                <span className={`block h-4 w-4 rounded-full bg-blanc shadow transition-transform ${notifEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
              <label className="text-sm font-medium text-texte">
                Activer les notifications email
              </label>
            </div>

            {notifEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-texte mb-1">
                    Email de réception
                  </label>
                  <input type="email" value={notifEmail} onChange={(e) => setNotifEmail(e.target.value)}
                    className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                    placeholder="votre@email.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">SMTP Host</label>
                    <input type="text" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)}
                      className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">SMTP Port</label>
                    <input type="text" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)}
                      className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-texte mb-1">SMTP Utilisateur (email expéditeur)</label>
                  <input type="text" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                    placeholder="votre@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-texte mb-1">SMTP Mot de passe (mot de passe d&apos;application Gmail)</label>
                  <input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)}
                    className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                    placeholder="xxxx xxxx xxxx xxxx" />
                </div>
                <div className="rounded-lg bg-creme p-3 text-xs text-texte-light">
                  <p className="font-medium text-texte mb-1">Pour Gmail :</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>Activez l&apos;authentification à 2 facteurs sur votre compte Google</li>
                    <li>Allez sur <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-marine underline">google.com/apppasswords</a></li>
                    <li>Créez un mot de passe d&apos;application pour &quot;Courrier&quot;</li>
                    <li>Copiez-collez le mot de passe généré ci-dessus</li>
                  </ol>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
