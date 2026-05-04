import { motion } from "framer-motion";
import { Target, CheckCircle2 } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";

export function GoalsSection() {
  const { data } = useDashboard();
  const dailyGoal = data?.dailyGoal;
  if (!dailyGoal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 h-full flex flex-col card-hover"
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-sm font-heading font-semibold text-foreground">Daily Goal</h3>
        </div>
        <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/10 p-6 text-center font-mono text-sm text-muted-foreground">
          No daily goal configured.
        </div>
      </motion.div>
    );
  }
  const pct = (dailyGoal.completed / dailyGoal.target) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85 }}
      className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 h-full flex flex-col card-hover"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Target className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-heading font-semibold text-foreground">Daily Goal</h3>
      </div>

      {/* Circular progress */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - pct / 100) }}
              transition={{ delay: 1, duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-heading text-foreground">{dailyGoal.completed}</span>
            <span className="text-[10px] text-muted-foreground font-mono">of {dailyGoal.target}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-mono">{dailyGoal.label}</p>
      </div>

      {/* Quick progress items */}
      <div className="mt-4 space-y-2">
        {Array.from({ length: dailyGoal.target }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono card-hover ${
              i < dailyGoal.completed
                ? "text-primary bg-primary/5"
                : "text-muted-foreground"
            }`}
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${i < dailyGoal.completed ? "text-primary" : "text-muted"}`} />
            Problem {i + 1}
            {i < dailyGoal.completed && <span className="ml-auto text-[10px] text-primary">Done</span>}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
