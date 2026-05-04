import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Activity = "deep" | "box" | "eyes";

/* ─── Deep Breathing ─── */
function DeepBreathing() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(4);

  const PHASES: { name: "inhale" | "hold" | "exhale"; label: string; duration: number; color: string }[] = [
    { name: "inhale", label: "Inhale", duration: 4, color: "from-sky-400/30 to-primary/20" },
    { name: "hold", label: "Hold", duration: 2, color: "from-violet-400/30 to-primary/20" },
    { name: "exhale", label: "Exhale", duration: 6, color: "from-emerald-400/30 to-primary/10" },
  ];

  const currentPhase = PHASES.find((p) => p.name === phase)!;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhase((prev) => {
            const idx = PHASES.findIndex((p) => p.name === prev);
            const next = PHASES[(idx + 1) % PHASES.length];
            return next.name;
          });
          return currentPhase.duration;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, phase]);

  const reset = () => { setActive(false); setPhase("inhale"); setCount(4); };

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="font-mono text-sm text-muted-foreground text-center max-w-xs">
        4-2-6 breathing: inhale for 4s, hold for 2s, exhale for 6s. Activates your parasympathetic nervous system.
      </p>
      <div className="relative flex items-center justify-center h-48 w-48">
        {/* Outer pulse rings */}
        {active && (
          <>
            <motion.div
              className={cn("absolute rounded-full bg-gradient-to-br opacity-20", currentPhase.color)}
              animate={phase === "inhale" ? { scale: [1, 1.8], opacity: [0.3, 0] } : phase === "exhale" ? { scale: [1.8, 1], opacity: [0, 0.3] } : { scale: 1.8 }}
              transition={{ duration: currentPhase.duration, ease: "easeInOut" }}
              style={{ width: "100%", height: "100%" }}
            />
          </>
        )}
        {/* Main circle */}
        <motion.div
          className={cn("flex flex-col items-center justify-center rounded-full border-2 border-primary/30 bg-gradient-to-br", currentPhase.color)}
          animate={active
            ? phase === "inhale" ? { scale: 1.4 } : phase === "exhale" ? { scale: 0.8 } : { scale: 1.2 }
            : { scale: 1 }
          }
          transition={{ duration: currentPhase.duration, ease: "easeInOut" }}
          style={{ width: "140px", height: "140px" }}
        >
          <span className="font-heading text-3xl font-bold text-foreground">{active ? count : "·"}</span>
          <span className="font-mono text-xs text-muted-foreground capitalize">{active ? currentPhase.label : "Ready"}</span>
        </motion.div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={reset} className="rounded-xl gap-2 font-mono text-xs">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
        <Button size="sm" onClick={() => setActive((a) => !a)} className="rounded-xl gap-2 font-mono text-xs">
          <Play className="h-3.5 w-3.5" /> {active ? "Pause" : "Start"}
        </Button>
      </div>
    </div>
  );
}

/* ─── Box Breathing ─── */
function BoxBreathing() {
  const SIDES = ["Inhale", "Hold", "Exhale", "Hold"] as const;
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(4);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setStep((s) => (s + 1) % 4);
          return 4;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const reset = () => { setActive(false); setStep(0); setCount(4); };

  const boxColors = [
    "border-sky-400/60 bg-sky-400/10",
    "border-violet-400/60 bg-violet-400/10",
    "border-emerald-400/60 bg-emerald-400/10",
    "border-amber-400/60 bg-amber-400/10",
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="font-mono text-sm text-muted-foreground text-center max-w-xs">
        4-4-4-4 box breathing: each side is 4 seconds. Used by Navy SEALs to stay calm under pressure.
      </p>

      {/* Box visualization */}
      <div className="relative h-44 w-44">
        {/* Box outline */}
        <div className={cn("absolute inset-0 rounded-2xl border-2 transition-all duration-500", boxColors[step])} />
        {/* Dot moving around the box */}
        <motion.div
          className="absolute h-5 w-5 rounded-full bg-primary shadow-lg"
          style={{ boxShadow: "0 0 12px hsl(var(--primary) / 0.8)" }}
          animate={active ? {
            x: [0, 120, 120, 0][step],
            y: [0, 0, 120, 120][step],
          } : { x: 0, y: 0 }}
          transition={{ duration: count, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
          <span className="font-heading text-3xl font-bold text-foreground">{active ? count : "·"}</span>
          <span className="font-mono text-xs text-muted-foreground">{active ? SIDES[step] : "Ready"}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={reset} className="rounded-xl gap-2 font-mono text-xs">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
        <Button size="sm" onClick={() => setActive((a) => !a)} className="rounded-xl gap-2 font-mono text-xs">
          <Play className="h-3.5 w-3.5" /> {active ? "Pause" : "Start"}
        </Button>
      </div>
    </div>
  );
}

/* ─── Relax Eyes ─── */
function RelaxEyes() {
  const [active, setActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(20);
  const DURATION = 20;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(id); setActive(false); return DURATION; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const start = () => { setSecondsLeft(DURATION); setActive(true); };

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="font-mono text-sm text-muted-foreground text-center max-w-xs">
        The 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.
      </p>

      <div className="relative flex items-center justify-center">
        <motion.div
          className="h-36 w-36 rounded-full border-2 border-emerald-400/40 bg-emerald-400/5 flex flex-col items-center justify-center"
          animate={active ? { scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Eye className="h-10 w-10 text-emerald-400 mb-2" />
          <span className="font-mono text-2xl font-bold text-foreground">{active ? secondsLeft : DURATION}</span>
          <span className="font-mono text-xs text-muted-foreground">seconds</span>
        </motion.div>
      </div>

      <Button
        size="sm"
        onClick={start}
        disabled={active}
        className="rounded-xl gap-2 font-mono text-xs bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
      >
        <Play className="h-3.5 w-3.5" />
        {active ? "Look away now…" : "Start 20s Timer"}
      </Button>
    </div>
  );
}

/* ─── Main MeditationCard ─── */
export function MeditationCard() {
  const [activity, setActivity] = useState<Activity>("deep");

  const tabs: { id: Activity; label: string; emoji: string }[] = [
    { id: "deep", label: "Deep Breathing", emoji: "🌬️" },
    { id: "box", label: "Box Breathing", emoji: "📦" },
    { id: "eyes", label: "Relax Eyes", emoji: "👁️" },
  ];

  return (
    <div className="space-y-8">
      {/* Tab selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActivity(t.id)}
            className={cn(
              "rounded-xl px-4 py-2 font-mono text-xs transition-all duration-200 border",
              activity === t.id
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-muted/10 border-border/30 text-muted-foreground hover:border-primary/20 hover:text-foreground"
            )}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activity}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activity === "deep" && <DeepBreathing />}
          {activity === "box" && <BoxBreathing />}
          {activity === "eyes" && <RelaxEyes />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
