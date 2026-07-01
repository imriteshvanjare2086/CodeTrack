import { X } from "lucide-react";
import { motion } from "framer-motion";
import { BadgeArtwork, rarityStyles } from "@/components/achievements/AchievementBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/lib/achievements";
import { formatAchievementDate } from "@/lib/achievements";

export function AchievementDetailModal({
  achievement,
  onClose,
}: {
  achievement: Achievement;
  onClose: () => void;
}) {
  const rarity = rarityStyles[achievement.rarity];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        className="glass relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-border/50 p-6 shadow-2xl"
      >
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40", rarity.gradient)} />
        <div className="absolute inset-0 bg-background/80" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-xl border border-white/10 bg-white/5 p-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close achievement details"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center">
          <BadgeArtwork achievement={achievement} size="lg" />

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className={cn("rounded-full border px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest", rarity.border, rarity.bg, rarity.text)}>
              {achievement.rarity}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {achievement.category}
            </span>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground">
            {achievement.title}
          </h2>
          <p className="mt-2 max-w-sm font-mono text-sm leading-relaxed text-muted-foreground">
            {achievement.description}
          </p>

          <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailTile label="Requirement" value={achievement.requirement} />
            <DetailTile label={achievement.earned ? "Unlocked On" : "Status"} value={achievement.earned ? formatAchievementDate(achievement.earnedDate) : "Locked"} />
          </div>

          {!achievement.earned && (
            <div className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
              <div className="mb-2 flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span>{achievement.currentProgress} / {achievement.targetProgress}</span>
                <span>{achievement.percent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className={cn("h-full rounded-full bg-gradient-to-r", rarity.gradient)} style={{ width: `${achievement.percent}%` }} />
              </div>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {achievement.remaining} remaining to unlock this badge.
              </p>
            </div>
          )}

          <Button onClick={onClose} className="mt-6 w-full rounded-xl">
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function DetailTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-sm font-black text-foreground">{value}</p>
    </div>
  );
}
