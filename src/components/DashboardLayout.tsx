import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PanelLeft } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Floating sidebar trigger only shown on mobile
function MobileSidebarFAB() {
  const { openMobile, setOpenMobile } = useSidebar();
  return (
    <button
      onClick={() => setOpenMobile(!openMobile)}
      className="fixed bottom-[4.5rem] left-4 z-50 md:hidden flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all duration-200 ring-2 ring-primary/20"
      aria-label="Open sidebar"
    >
      <PanelLeft className="h-5 w-5" />
    </button>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-[100dvh] w-full relative overflow-hidden bg-background">
        {/* Dynamic Background Glow */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000 opacity-40"
          style={{
            background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, hsla(var(--primary), 0.15), transparent 80%)`,
          }}
        />
        
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col relative z-10 transition-all duration-200">
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="min-h-0 flex-1 overflow-auto p-3 sm:p-4 md:p-6 pb-[5.5rem] md:pb-6"
            >
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </motion.main>
          </AnimatePresence>
        </div>

        {/* Mobile sticky bottom nav */}
        <MobileBottomNav />
        {/* Mobile floating sidebar trigger (stays fixed even when scrolled) */}
        <MobileSidebarFAB />
      </div>
    </SidebarProvider>
  );
}

