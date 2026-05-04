import { motion } from "framer-motion";
import { ArrowRight, Brain } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";

export function SmartRecommendations() {
  const { data } = useDashboard();
  const recommendations = (data?.recommendations || []) as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75 }}
      className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 card-hover"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-heading font-semibold text-foreground">Smart Recommendations</h3>
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Personalized based on your performance</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {recommendations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 p-4 text-center font-mono text-sm text-muted-foreground">
            No recommendations yet.
          </div>
        ) : (
        recommendations.map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.06 }}
            className="group flex items-center gap-3 rounded-xl bg-muted/40 border border-border/30 p-3.5 text-xs text-secondary-foreground font-mono card-hover"
          >
            <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
            <span className="flex-1">{text}</span>
          </motion.div>
        ))
        )}
      </div>
    </motion.div>
  );
}
