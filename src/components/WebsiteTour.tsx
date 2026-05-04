import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position: "bottom" | "top" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "tour-sidebar-inner",
    title: "Dynamic Sidebar",
    description: "Explore Learning Paths, weekly challenges, and your personal coding vault from this panel.",
    position: "right",
  },
  {
    targetId: "tour-search",
    title: "Global Search",
    description: "Quickly find any feature or problem using the Command+K search bar.",
    position: "bottom",
  },
  {
    targetId: "tour-stats",
    title: "Performance Heatmap",
    description: "Track your daily consistency and problem-solving activity across multiple platforms.",
    position: "bottom",
  },
  {
    targetId: "tour-platforms",
    title: "Platform Stats",
    description: "Detailed metrics for your LeetCode, Codeforces, and CodeChef accounts gathered in one place.",
    position: "top",
  },
  {
    targetId: "tour-profile",
    title: "Your Account",
    description: "Manage your profile, change your photo, and view your account settings here.",
    position: "bottom",
  },
];

export function WebsiteTour({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[currentStep];

  useEffect(() => {
    const updateRect = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        // Only scroll if not the sidebar (which is fixed)
        if (step.targetId !== "tour-sidebar-inner") {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        
        // Brief delay to allow scroll/layout to settle
        setTimeout(() => {
          setTargetRect(el.getBoundingClientRect());
        }, 150);
      }
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect);
    
    // Periodically check in case of layout shifts or animations
    const interval = setInterval(updateRect, 800);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
      clearInterval(interval);
    };
  }, [step]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Spotlight positioning with more breathing room
  const spotlightStyle = useMemo(() => {
    if (!targetRect) return null;
    const padding = 12;
    return {
      top: targetRect.top - padding,
      left: targetRect.left - padding,
      width: targetRect.width + (padding * 2),
      height: targetRect.height + (padding * 2),
    };
  }, [targetRect]);

  const getTooltipPosition = () => {
    if (!targetRect || !spotlightStyle) return { top: 0, left: 0 };
    const gap = 24;
    const tooltipWidth = 320;
    let top = 0;
    let left = 0;

    switch (step.position) {
      case "right":
        top = targetRect.top;
        left = spotlightStyle.left + spotlightStyle.width + gap;
        break;
      case "left":
        top = targetRect.top;
        left = spotlightStyle.left - gap - tooltipWidth;
        break;
      case "top":
        top = spotlightStyle.top - gap - 220;
        left = spotlightStyle.left + (spotlightStyle.width / 2) - (tooltipWidth / 2);
        break;
      case "bottom":
      default:
        top = spotlightStyle.top + spotlightStyle.height + gap;
        left = spotlightStyle.left + (spotlightStyle.width / 2) - (tooltipWidth / 2);
        break;
    }

    const padding = 24;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left < padding) left = padding;
    if (left + tooltipWidth > viewportWidth - padding) {
      left = viewportWidth - tooltipWidth - padding;
    }

    if (top < padding) top = padding;
    if (top + 250 > viewportHeight) top = viewportHeight - 300;

    return { top, left };
  };

  const tooltipPos = getTooltipPosition();

  if (!targetRect || !spotlightStyle) return null;

  const tourOverlay = (
    <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      {/* Dimmed Overlay with Spotlight Hole */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-background/90 backdrop-blur-[1px] pointer-events-auto"
        style={{
          clipPath: `polygon(
            0% 0%, 
            0% 100%, 
            ${spotlightStyle.left}px 100%, 
            ${spotlightStyle.left}px ${spotlightStyle.top}px, 
            ${spotlightStyle.left + spotlightStyle.width}px ${spotlightStyle.top}px, 
            ${spotlightStyle.left + spotlightStyle.width}px ${spotlightStyle.top + spotlightStyle.height}px, 
            ${spotlightStyle.left}px ${spotlightStyle.top + spotlightStyle.height}px, 
            ${spotlightStyle.left}px 100%, 
            100% 100%, 
            100% 0%
          )`,
        }}
      />

      {/* Actual spotlight highlight border */}
      <motion.div
        layoutId="spotlight"
        className="absolute rounded-[2rem] border-2 border-primary shadow-[0_0_50px_hsla(var(--primary),0.4)] z-10"
        animate={spotlightStyle}
        transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
      />

      {/* Tooltip Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="absolute w-[320px] glass rounded-[2rem] border border-primary/30 p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto z-20"
          style={tooltipPos}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <button onClick={onComplete} className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <X className="h-5 w-5" />
            </button>
          </div>

          <h3 className="font-heading text-lg font-black text-foreground mb-2 tracking-tight">
            {step.title}
          </h3>
          <p className="font-mono text-[11px] text-muted-foreground/80 leading-relaxed mb-8 uppercase tracking-wider font-bold">
            {step.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-muted-foreground/40 font-black uppercase tracking-[0.2em]">
                Progress
              </span>
              <span className="text-[10px] font-mono text-primary font-black uppercase">
                {currentStep + 1} / {TOUR_STEPS.length}
              </span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBack} 
                className="h-9 rounded-xl text-[9px] font-bold tracking-widest border-white/10 hover:bg-white/5"
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> BACK
              </Button>
              <Button 
                size="sm" 
                onClick={handleNext} 
                className="h-9 rounded-xl text-[9px] font-bold tracking-widest px-5 shadow-lg shadow-primary/20"
              >
                {currentStep === TOUR_STEPS.length - 1 ? "FINISH" : "NEXT"} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return createPortal(tourOverlay, document.body);
}
