import { ArrowUpRight, CheckCircle2, CircleGauge, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GoalRecommendation = {
  id: string;
  platform: "Overall" | "LeetCode" | "Codeforces" | "CodeChef";
  metric: "Problems" | "Rating" | "Ranking" | "Contests" | "Rank";
  title: string;
  description: string;
  current: string;
  target: string;
  priority: "High" | "Medium" | "Low" | "Done";
  actions: string[];
  goalTitle: string;
  goalCategory: string;
  targetNumber?: string;
};

const priorityStyles = {
  High: "border-rose-500/25 bg-rose-500/10 text-rose-300",
  Medium: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  Low: "border-sky-500/25 bg-sky-500/10 text-sky-300",
  Done: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
};

export function RecommendationCard({
  recommendation,
  onAddGoal,
}: {
  recommendation: GoalRecommendation;
  onAddGoal?: (recommendation: GoalRecommendation) => void;
}) {
  const isDone = recommendation.priority === "Done";

  return (
    <div
      className={cn(
        "glass relative overflow-hidden rounded-2xl border border-border/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl",
        isDone && "bg-emerald-500/[0.03]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
            isDone ? "border-emerald-500/20 bg-emerald-500/10" : "border-primary/20 bg-primary/10"
          )}>
            {isDone ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <CircleGauge className="h-5 w-5 text-primary" />
            )}
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border/50 bg-muted/20 px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {recommendation.platform}
              </span>
              <span className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest",
                priorityStyles[recommendation.priority]
              )}>
                {recommendation.priority}
              </span>
            </div>
            <h3 className="font-heading text-base font-black leading-snug text-foreground">
              {recommendation.title}
            </h3>
            <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
              {recommendation.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border/40 bg-muted/10 p-3">
          <p className="font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current</p>
          <p className="mt-1 font-heading text-lg font-black text-foreground">{recommendation.current}</p>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3">
          <p className="font-mono text-[10px] font-black uppercase tracking-widest text-primary/80">Target</p>
          <p className="mt-1 font-heading text-lg font-black text-foreground">{recommendation.target}</p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {recommendation.actions.map((action) => (
          <div key={action} className="flex items-start gap-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
            <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{action}</span>
          </div>
        ))}
      </div>

      {!isDone && onAddGoal ? (
        <Button onClick={() => onAddGoal(recommendation)} className="mt-5 w-full gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          Add As Goal
        </Button>
      ) : null}
    </div>
  );
}
