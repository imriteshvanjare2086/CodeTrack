import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Award, Code2, Zap, ArrowRight, Activity, X } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface Badge {
  name: string;
  description: string;
  platform: "leetcode" | "codeforces" | "codechef" | string;
}

interface HeroStatsData {
  totalProblems: number;
  currentStreak: number;
  longestStreak: number;
  level: string;
  badges?: Badge[];
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
    label: "Current Streak",
    icon: Flame,
    color: "text-leetcode dark:text-leetcode",
    bgColor: "bg-amber-50 dark:bg-leetcode/15",
    gradientColor: "from-amber-100/50 to-amber-50/30 dark:from-leetcode/20 dark:to-leetcode/5",
    glowClass: "card-glow-leetcode",
    borderColor: "border-amber-100 dark:border-leetcode/20",
  },
  {
    label: "Level",
    icon: Trophy,
    color: "text-codeforces dark:text-codeforces",
    bgColor: "bg-blue-50 dark:bg-codeforces/15",
    gradientColor: "from-blue-100/50 to-blue-50/30 dark:from-codeforces/20 dark:to-codeforces/5",
    glowClass: "card-glow-codeforces",
    borderColor: "border-blue-100 dark:border-codeforces/20",
  },
  {
    label: "Longest Streak",
    icon: Zap,
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
    currentStreak: 0,
    longestStreak: 0,
    level: "Beginner",
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
    } else if (c.label === "Current Streak") {
      card.value = stats.currentStreak;
      card.suffix = " days";
      card.isNumeric = true;
    } else if (c.label === "Level") {
      card.value = stats.level;
      card.isNumeric = false;
    } else if (c.label === "Longest Streak") {
      card.value = stats.longestStreak;
      card.suffix = " days";
      card.isNumeric = true;
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
      <div className="relative z-10 flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
          <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg sm:text-2xl font-heading font-black text-foreground tracking-tight">Performance Overview</h3>
          <p className="text-sm text-muted-foreground font-mono mt-0.5 flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
            Quick summary of your overall progress
          </p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-5">
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
              <div className="flex items-start justify-between mb-2 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-transparent flex items-center justify-center shadow-sm`}>
                    <card.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.color}`} />
                  </div>
                  <h3 className="text-[10px] sm:text-sm font-heading font-bold text-foreground leading-tight">{card.label}</h3>
                </div>
                {card.label === "Current Streak" && stats.currentStreak > 0 && (
                  <div className={`shrink-0 px-2 py-1 rounded-full bg-emerald-50 dark:bg-background/30 border border-emerald-100 dark:border-transparent text-[9px] font-mono ${card.color} font-bold uppercase flex items-center gap-1.5 ml-2`}>
                    <span className={`flex h-1.5 w-1.5 rounded-full bg-leetcode`} />
                    Active
                  </div>
                )}
              </div>
              
              <div className="text-center mt-2">
                <p className="text-[8px] sm:text-[10px] text-[#475569] dark:text-muted-foreground uppercase tracking-[0.1em] sm:tracking-[0.2em] font-mono font-black mb-1">
                  {card.label === "Total Problems" ? "Solved" : 
                   card.label === "Current Streak" ? "Active" : 
                   card.label === "Level" ? "Rank" : "Max"}
                </p>
                <h4 className={`text-xl sm:text-3xl md:text-4xl font-black font-heading tracking-tighter ${card.color}`}>
                  {card.isNumeric ? (
                    <AnimatedCounter value={Number(card.value)} suffix={card.suffix} />
                  ) : (
                    card.value
                  )}
                </h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Badges Section */}
      <div className="relative z-10 pt-8 border-t border-foreground/10">
        
        {/* Achievements Section Header */}
        <div className="relative z-10 flex items-center gap-4 mb-4">
          <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-inner">
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-heading font-black text-foreground tracking-tight">Achievements</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-mono mt-0.5 flex items-center gap-2">
              <span className="flex h-1 w-1 rounded-full bg-muted-foreground/30" />
              Your earned badges and milestones
            </p>
          </div>
        </div>
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-sm font-bold text-[#64748B] dark:text-muted-foreground uppercase tracking-wider">Badges</span>
            <span className="text-xl sm:text-3xl font-heading font-black text-foreground tracking-tighter">{currentBadges.length}</span>
          </div>
          <button 
            onClick={() => setIsViewAllOpen(true)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-foreground/5 rounded-full transition-colors group"
          >
            <ArrowRight className="h-5 w-5 text-slate-400 dark:text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
          </button>
        </div>

        {currentBadges.length > 0 ? (
          <div className="flex flex-col gap-6">
            {/* 3 Badges Centered */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 relative z-10 py-2">
              {currentBadges.slice(0, 3).map((badge: Badge, i: number) => {
                let Icon = Award;
                let colorClass = "text-primary";
                let gradientClass = "from-primary/20 to-primary/5";
                let borderColor = "border-primary/30";
                
                if (badge.platform === "leetcode") {
                  Icon = Flame;
                  colorClass = "text-leetcode";
                  gradientClass = "from-leetcode/20 to-leetcode/5";
                  borderColor = "border-leetcode/30";
                } else if (badge.platform === "codeforces") {
                  Icon = Trophy;
                  colorClass = "text-codeforces";
                  gradientClass = "from-codeforces/20 to-codeforces/5";
                  borderColor = "border-codeforces/30";
                } else if (badge.platform === "codechef") {
                  Icon = Code2;
                  colorClass = "text-codechef";
                  gradientClass = "from-codechef/20 to-codechef/5";
                  borderColor = "border-codechef/30";
                }

                // Middle badge is slightly larger
                const isCenter = i === 1;
                const sizeClass = isCenter ? "w-20 h-24 sm:w-36 sm:h-40" : "w-16 h-20 sm:w-32 sm:h-36";
                const iconSize = isCenter ? "h-8 w-8 sm:h-16 sm:w-16" : "h-6 w-6 sm:h-14 sm:w-14";

                return (
                  <motion.div 
                    key={badge.name} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.03, type: "spring", stiffness: 600, damping: 25 }}
                    className={`group relative flex flex-col items-center justify-center ${sizeClass} bg-gradient-to-b ${gradientClass} transition-all duration-100 hover:drop-shadow-[0_0_20px_rgba(var(--primary),0.3)] card-hover`}
                    style={{ 
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      // Adding an inner border effect via box-shadow doesn't work well with clip-path, 
                      // so we rely on the gradient and drop-shadow
                    }}
                    title={badge.description}
                  >
                    {/* Inner Hexagon for Border Effect */}
                    <div 
                      className={`absolute inset-[2px] bg-white dark:bg-slate-900 flex flex-col items-center justify-center z-0`}
                      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                    />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <Icon className={`${iconSize} ${colorClass} mb-1 drop-shadow-md`} />
                      <span className={`text-[10px] font-mono font-black ${colorClass}`}>
                        {new Date().getFullYear()}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Most Recent Badge Footer */}
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-muted-foreground">Most Recent Badge</span>
              <span className="text-[14px] font-semibold text-foreground tracking-tight">
                {currentBadges[currentBadges.length - 1].name}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 rounded-[2rem] border-2 border-dashed border-foreground/5 bg-foreground/[0.02] relative group/empty card-hover">
            <div className="p-5 rounded-3xl bg-muted/20 mb-5 relative">
               <Code2 className="h-8 w-8 text-muted-foreground/30 transition-transform group-hover/empty:scale-110 duration-500" />
               <div className="absolute inset-0 rounded-3xl animate-pulse ring-1 ring-primary/20" />
            </div>
            <p className="text-base font-heading font-bold text-foreground/80 tracking-tight">No badges earned yet</p>
            <p className="text-xs text-muted-foreground font-mono mt-2 text-center max-w-xs leading-relaxed uppercase tracking-tighter">
              Solve problems and participate in weekly challenges to build your collection
            </p>
          </div>
        )}
      </div>

      {/* View All Badges Modal */}
      <AnimatePresence>
        {isViewAllOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewAllOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[80vh] bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col premium-border"
            >
              <div className="p-6 border-b border-slate-100 dark:border-foreground/10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-heading font-black text-foreground">All Achievements</h3>
                  <p className="text-xs text-muted-foreground font-mono">Unlock more badges by completing challenges</p>
                </div>
                <button 
                  onClick={() => setIsViewAllOpen(false)}
                  className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-muted-foreground" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                  {currentBadges.map((badge, i) => {
                    let Icon = Award;
                    let colorClass = "text-primary";
                    let gradientClass = "from-primary/20 to-primary/5";
                    let borderColor = "border-primary/30";
                    
                    if (badge.platform === "leetcode") {
                      Icon = Flame;
                      colorClass = "text-leetcode";
                      gradientClass = "from-leetcode/20 to-leetcode/5";
                      borderColor = "border-leetcode/30";
                    } else if (badge.platform === "codeforces") {
                      Icon = Trophy;
                      colorClass = "text-codeforces";
                      gradientClass = "from-codeforces/20 to-codeforces/5";
                      borderColor = "border-codeforces/30";
                    } else if (badge.platform === "codechef") {
                      Icon = Code2;
                      colorClass = "text-codechef";
                      gradientClass = "from-codechef/20 to-codechef/5";
                      borderColor = "border-codechef/30";
                    }

                    return (
                      <motion.div 
                        key={badge.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.02, duration: 0.1 }}
                        className="flex flex-col items-center gap-3 group cursor-help card-hover"
                        title={badge.description}
                      >
                        <div 
                          className={`w-28 h-32 bg-gradient-to-b ${gradientClass} relative transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(var(--primary),0.2)] card-hover`}
                          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                        >
                          <div 
                            className="absolute inset-[2px] bg-white dark:bg-slate-900 flex items-center justify-center"
                            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                          >
                            <Icon className={`h-12 w-12 ${colorClass}`} />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className={`text-xs font-bold ${colorClass} leading-tight`}>{badge.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase mt-0.5">{badge.platform}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
