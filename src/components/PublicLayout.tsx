"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const [loaded, setLoaded] = useState(!isHome);

  const handlePreloaderDone = useCallback(() => {
    setLoaded(true);
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      {isHome && !loaded && <Preloader onComplete={handlePreloaderDone} />}
      <div style={{ opacity: isHome && !loaded ? 0 : 1, transition: "opacity 0.4s ease" }}>
        {!isHome && <Header />}
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
