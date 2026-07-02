import { motion } from "framer-motion";
import { Check, ListPlus } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { useEffect, useState } from "react";

export function SmartRecommendations() {
  const { data } = useDashboard();
  const recommendations = (data?.recommendations || []) as string[];
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("codecraft_saved_recommendations") || "[]"));
    } catch {
      setSaved([]);
    }
  }, []);

  const addToList = (text: string) => {
    if (saved.includes(text)) return;
    const next = [...saved, text];
    setSaved(next);
    localStorage.setItem("codecraft_saved_recommendations", JSON.stringify(next));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75 }}
      className="rounded-[2rem] border border-white/10 bg-card/50 p-5 shadow-xl backdrop-blur-xl card-hover"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-black text-foreground">Recommendations</h3>
          <p className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Stats-based focus list
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-primary">
            {recommendations.length} item{recommendations.length === 1 ? "" : "s"}
          </div>
          {saved.length > 0 && (
            <div className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-green-400">
              {saved.length} saved
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {recommendations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-muted/10 p-5 text-center font-mono text-sm text-muted-foreground">
            No recommendations right now. Your connected stats are above the current focus thresholds.
          </div>
        ) : (
          recommendations.map((text, i) => {
            const isSaved = saved.includes(text);

            return (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.06 }}
                className="grid grid-cols-1 items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 transition-all hover:border-primary/25 hover:bg-white/[0.055] sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <p className="font-mono text-xs leading-relaxed text-foreground">{text}</p>
                <button
                  type="button"
                  onClick={() => addToList(text)}
                  disabled={isSaved}
                  className="inline-flex h-9 w-fit items-center gap-2 whitespace-nowrap rounded-xl border border-primary/20 bg-primary/10 px-3 font-mono text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:border-green-400/25 disabled:bg-green-400/10 disabled:text-green-400"
                >
                  {isSaved ? <Check className="h-3.5 w-3.5" /> : <ListPlus className="h-3.5 w-3.5" />}
                  {isSaved ? "Added" : "Add to list"}
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
