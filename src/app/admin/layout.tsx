"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  Calendar,
  ImageIcon,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Accueil", icon: LayoutDashboard },
  { href: "/admin/plats", label: "Plats", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Catégories", icon: FolderTree },
  { href: "/admin/calendrier", label: "Calendrier", icon: Calendar },
  { href: "/admin/galerie", label: "Galerie", icon: ImageIcon },
  { href: "/admin/demandes", label: "Demandes reçues", icon: MessageSquare },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/reglages", label: "Réglages", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)]">
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-4 right-4 z-50 lg:hidden flex h-12 w-12 items-center justify-center rounded-full bg-marine text-creme shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar overlay mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 lg:top-20 bottom-0 z-40 w-64 bg-marine overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="mb-6 px-3">
            <Image
              src="/images/logo.svg"
              alt="A Cas'a Mina"
              width={140}
              height={48}
              className="h-10 w-auto"
            />
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-marine-light text-creme"
                      : "text-creme/60 hover:bg-marine-light/50 hover:text-creme"
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-creme/10 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-creme/60 transition-colors hover:bg-marine-light/50 hover:text-creme"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
