import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
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
      <div className="flex min-h-screen w-full relative overflow-hidden bg-background">
        {/* Dynamic Background Glow */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000 opacity-40"
          style={{
            background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, hsla(var(--primary), 0.15), transparent 80%)`,
          }}
        />
        
        {/* Ambient background noise/grain could go here if needed */}
        
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
              className="min-h-0 flex-1 overflow-auto p-3 sm:p-4 md:p-6 pb-24 md:pb-6"
            >
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </SidebarProvider>
  );
}

