import {
  Award,
  BadgeCheck,
  Bolt,
  Crown,
  Flame,
  Lock,
  Medal,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Achievement, AchievementIcon, AchievementRarity } from "@/lib/achievements";

export const rarityStyles: Record<AchievementRarity, {
  text: string;
  border: string;
  bg: string;
  glow: string;
  gradient: string;
}> = {
  Common: {
    text: "text-emerald-300",
    border: "border-emerald-400/25",
    bg: "bg-emerald-500/10",
    glow: "shadow-emerald-500/15",
    gradient: "from-emerald-300/30 via-emerald-500/15 to-slate-900",
  },
  Uncommon: {
    text: "text-sky-300",
    border: "border-sky-400/25",
    bg: "bg-sky-500/10",
    glow: "shadow-sky-500/15",
    gradient: "from-sky-300/30 via-sky-500/15 to-slate-900",
  },
  Rare: {
    text: "text-violet-300",
    border: "border-violet-400/25",
    bg: "bg-violet-500/10",
    glow: "shadow-violet-500/20",
    gradient: "from-violet-300/35 via-violet-500/20 to-slate-900",
  },
  Epic: {
    text: "text-amber-300",
    border: "border-amber-400/30",
    bg: "bg-amber-500/10",
    glow: "shadow-amber-500/25",
    gradient: "from-amber-200/40 via-yellow-500/20 to-stone-950",
  },
  Legendary: {
    text: "text-rose-300",
    border: "border-rose-400/35",
    bg: "bg-rose-500/10",
    glow: "shadow-rose-500/30",
    gradient: "from-rose-300/40 via-orange-400/20 to-slate-950",
  },
};

const iconMap: Record<AchievementIcon, typeof Trophy> = {
  award: Award,
  badge: BadgeCheck,
  bolt: Bolt,
  crown: Crown,
  flame: Flame,
  medal: Medal,
  shield: Shield,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  trophy: Trophy,
};

export function BadgeArtwork({
  achievement,
  size = "md",
}: {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = iconMap[achievement.icon];
  const rarity = rarityStyles[achievement.rarity];
  const dimensions = size === "lg" ? "h-28 w-28" : size === "sm" ? "h-11 w-11" : "h-16 w-16";
  const iconSize = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-5 w-5" : "h-7 w-7";

  return (
    <div className={cn("relative flex shrink-0 items-center justify-center rounded-[1.35rem] border shadow-2xl", dimensions, rarity.border, rarity.glow)}>
      <div className={cn("absolute inset-0 rounded-[1.35rem] bg-gradient-to-br", rarity.gradient, !achievement.earned && "grayscale opacity-50")} />
      <div className="absolute inset-[3px] rounded-[1.1rem] border border-white/10 bg-white/[0.03]" />
      <Icon className={cn("relative z-10 drop-shadow-lg", iconSize, achievement.earned ? rarity.text : "text-muted-foreground")} />
      {!achievement.earned && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[1.35rem] bg-background/55 backdrop-blur-[1px]">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export function AchievementBadgeCard({
  achievement,
  onClick,
  compact = false,
}: {
  achievement: Achievement;
  onClick: () => void;
  compact?: boolean;
}) {
  const rarity = rarityStyles[achievement.rarity];

  return (
    <motion.button
      type="button"
      layout
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all",
        rarity.border,
        achievement.earned ? "bg-card/45 shadow-xl" : "bg-card/20 opacity-80 grayscale-[0.35]"
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-80", rarity.gradient)} />
      <div className="absolute inset-0 bg-background/70" />

      <div className="relative z-10 flex gap-3">
        <BadgeArtwork achievement={achievement} size={compact ? "sm" : "md"} />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest", rarity.border, rarity.bg, rarity.text)}>
              {achievement.rarity}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              {achievement.category}
            </span>
          </div>
          <h3 className="truncate font-heading text-sm font-black text-foreground">{achievement.title}</h3>
          <p className="mt-1 line-clamp-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {achievement.description}
          </p>

          {!achievement.earned && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                <span>{achievement.currentProgress} / {achievement.targetProgress}</span>
                <span>{achievement.percent}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className={cn("h-full rounded-full bg-gradient-to-r", rarity.gradient)} style={{ width: `${achievement.percent}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
