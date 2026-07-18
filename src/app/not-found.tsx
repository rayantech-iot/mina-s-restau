import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page non trouvée",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-6xl font-bold text-marine">404</h1>
      <p className="mt-4 text-xl text-texte-light">
        Cette page n&apos;existe pas
      </p>
      <a
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-marine px-6 py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
      >
        Retour à l&apos;accueil
      </a>
    </div>
  );
}
