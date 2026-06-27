import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Award, Code2, Zap, ArrowRight, Activity, X, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface Badge {
  name: string;
  description: string;
  platform: "leetcode" | "codeforces" | "codechef" | string;
}

interface HeroStatsData {
  totalProblems: number;
  totalContests: number;
  currentStreak: number;
  highestRating: number;
  highestRank: string;
  badges?: Badge[];
  leetcodeRating?: number;
  codeforcesRating?: number;
  codechefRating?: number;
  leetcodeRank?: string;
  codeforcesRank?: string;
  codechefRank?: string;
}

type StatCard = {
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  gradientColor: string;
  glowClass: string;
  borderColor: string;
  value?: string | number;
  suffix?: string;
  isNumeric?: boolean;
};

const statCards: StatCard[] = [
  {
    label: "Total Problems",
    icon: Code2,
    color: "text-primary dark:text-primary",
    bgColor: "bg-emerald-50 dark:bg-primary/15",
    gradientColor: "from-emerald-100/50 to-emerald-50/30 dark:from-primary/20 dark:to-primary/5",
    glowClass: "card-glow-primary",
    borderColor: "border-emerald-100 dark:border-primary/20",
  },
  {
    label: "Total Contests",
    icon: Trophy,
    color: "text-leetcode dark:text-leetcode",
    bgColor: "bg-amber-50 dark:bg-leetcode/15",
    gradientColor: "from-amber-100/50 to-amber-50/30 dark:from-leetcode/20 dark:to-leetcode/5",
    glowClass: "card-glow-leetcode",
    borderColor: "border-amber-100 dark:border-leetcode/20",
  },
  {
    label: "Highest Rating",
    icon: TrendingUp,
    color: "text-codeforces dark:text-codeforces",
    bgColor: "bg-blue-50 dark:bg-codeforces/15",
    gradientColor: "from-blue-100/50 to-blue-50/30 dark:from-codeforces/20 dark:to-codeforces/5",
    glowClass: "card-glow-codeforces",
    borderColor: "border-blue-100 dark:border-codeforces/20",
  },
  {
    label: "Highest Rank",
    icon: Award,
    color: "text-longest-streak dark:text-longest-streak",
    bgColor: "bg-rose-50 dark:bg-longest-streak/15",
    gradientColor: "from-rose-100/50 to-rose-50/30 dark:from-longest-streak/20 dark:to-longest-streak/5",
    glowClass: "card-glow-longest-streak",
    borderColor: "border-rose-100 dark:border-longest-streak/20",
  },
];
export function HeroStats({ stats: externalStats }: { stats?: HeroStatsData }) {
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  
  const defaultBadges: Badge[] = [
    { name: "First Solve", description: "Completed your first problem", platform: "leetcode" },
    { name: "Streak Starter", description: "Maintain a 3-day streak", platform: "leetcode" },
    { name: "Problem Crusher", description: "Solved 100 problems", platform: "codeforces" },
    { name: "Contestant", description: "Participated in 5 contests", platform: "codechef" },
    { name: "Night Owl", description: "Solve problems after midnight", platform: "leetcode" },
    { name: "Speed Demon", description: "Solve a problem in under 5 minutes", platform: "codeforces" },
    { name: "Consistency King", description: "30 day coding streak", platform: "codechef" },
    { name: "Bug Hunter", description: "Fixed 50 edge cases", platform: "leetcode" }
  ];

  const stats: HeroStatsData = externalStats || {
    totalProblems: 0,
    totalContests: 0,
    currentStreak: 0,
    highestRating: 0,
    highestRank: "None",
    badges: defaultBadges
  };

  const currentBadges = [
    ...(stats.badges || []),
    ...defaultBadges.filter(db => !(stats.badges || []).some(sb => sb.name === db.name))
  ].slice(0, 8);

  const cards = statCards.map((c) => {
    let card = { ...c };
    if (c.label === "Total Problems") {
      card.value = stats.totalProblems;
      card.isNumeric = true;
    } else if (c.label === "Total Contests") {
      card.value = stats.totalContests ?? 0;
      card.isNumeric = true;
    } else if (c.label === "Highest Rating") {
      const val = Number(stats.highestRating);
      card.value = isNaN(val) ? 0 : val;
      card.isNumeric = true;
    } else if (c.label === "Highest Rank") {
      card.value = stats.highestRank || "None";
      card.isNumeric = false;
    }
    return card;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] px-6 pt-3 pb-6 md:px-8 md:pt-4 md:pb-7 backdrop-blur-none dark:backdrop-blur-3xl shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] ring-0 dark:ring-1 dark:ring-white/5 relative overflow-hidden premium-border space-y-8 card-hover"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 dark:opacity-50 pointer-events-none" />

      {/* Upper Section: Performance Overview */}
      <div className="relative z-10 flex items-center gap-4 mb-6">
        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-heading font-black text-foreground tracking-tight">Performance Overview</h3>
          <p className="text-sm text-muted-foreground font-mono mt-0.5 flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
            Quick summary of your overall progress
          </p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              delay: i * 0.1, 
              duration: 0.5 
            }}
            className={`group relative rounded-3xl border border-slate-200 dark:border-transparent bg-slate-50 dark:bg-[#1A1A1E] dark:bg-gradient-to-br dark:${card.gradientColor} p-6 backdrop-blur-none dark:backdrop-blur-md overflow-hidden card-hover`}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 shrink-0 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-transparent flex items-center justify-center shadow-sm`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <h3 className="text-sm font-heading font-bold text-foreground leading-tight">{card.label}</h3>
                </div>
              </div>
              
              <div className="text-center mt-2">
                {(card.label === "Total Problems" || card.label === "Total Contests") && (
                  <>
                    <p className="text-[10px] text-[#475569] dark:text-muted-foreground uppercase tracking-[0.2em] font-mono font-black mb-1.5">
                      {card.label === "Total Problems" ? "Problems Solved" : "Contests Entered"}
                    </p>
                    <h4 className={`text-3xl md:text-4xl font-black font-heading tracking-tighter ${card.color}`}>
                      {card.isNumeric ? (
                        <AnimatedCounter value={Number(card.value)} suffix={card.suffix} />
                      ) : (
                        card.value
                      )}
                    </h4>
                  </>
                )}
              </div>

              {card.label === "Highest Rating" && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] grid grid-cols-3 text-[20px] font-mono font-bold">
                  <div className="flex flex-col items-center justify-center gap-1 px-1">
                    <span className="text-[14px] uppercase tracking-wider text-[#F7931A]">LC</span>
                    <span className="text-foreground">{stats.leetcodeRating || "—"}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-x border-slate-100 dark:border-white/[0.04] px-1">
                    <span className="text-[14px] uppercase tracking-wider text-[#1F8ACB]">CF</span>
                    <span className="text-foreground">{stats.codeforcesRating || "—"}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 px-1">
                    <span className="text-[14px] uppercase tracking-wider text-[#572E15] dark:text-[#B57C50]">CC</span>
                    <span className="text-foreground">{stats.codechefRating || "—"}</span>
                  </div>
                </div>
              )}

              {card.label === "Highest Rank" && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] grid grid-cols-3 text-[20px] font-mono font-bold">
                  {/* LC rank */}
                  <div className="flex flex-col items-center justify-center gap-1 px-1 overflow-hidden">
                    <span className="text-[14px] uppercase tracking-wider text-[#F7931A]">LC</span>
                    {(stats.leetcodeRank || "—").length > 4 ? (
                      <div className="marquee-container w-full">
                        <div className="marquee-track">
                          <span className="text-foreground" title={stats.leetcodeRank}>{stats.leetcodeRank || "—"}</span>
                          <span className="text-foreground" aria-hidden>{stats.leetcodeRank || "—"}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-foreground">{stats.leetcodeRank || "—"}</span>
                    )}
                  </div>
                  {/* CF rank */}
                  <div className="flex flex-col items-center justify-center gap-1 border-x border-slate-100 dark:border-white/[0.04] px-1 overflow-hidden">
                    <span className="text-[14px] uppercase tracking-wider text-[#1F8ACB]">CF</span>
                    {(stats.codeforcesRank || "—").length > 4 ? (
                      <div className="marquee-container w-full">
                        <div className="marquee-track">
                          <span className="text-foreground" title={stats.codeforcesRank}>{stats.codeforcesRank || "—"}</span>
                          <span className="text-foreground" aria-hidden>{stats.codeforcesRank || "—"}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-foreground">{stats.codeforcesRank || "—"}</span>
                    )}
                  </div>
                  {/* CC stars — always short */}
                  <div className="flex flex-col items-center justify-center gap-1 px-1">
                    <span className="text-[14px] uppercase tracking-wider text-[#572E15] dark:text-[#B57C50]">CC</span>
                    <span className="text-foreground">{stats.codechefRank || "—"}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
