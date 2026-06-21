import { motion } from "framer-motion";
import { Star, TrendingUp, Award, Hash } from "lucide-react";

interface PlatformStats {
  username: string;
  problemsSolved?: number;
  contestRating?: number;
  ranking?: number;
  currentRating?: number;
  maxRating?: number;
  rank?: string;
  contestCount?: number;
  stars?: string;
}

function PlatformCard({
  name,
  icon: Icon,
  colorClass,
  gradientColor,
  username,
  isConnected,
  mainStat,
  gridStats,
  delay
}: {
  name: string;
  icon: any;
  colorClass: string;
  gradientColor: string;
  username: string;
  isConnected: boolean;
  mainStat: { label: string; value: string | number };
  gridStats: Array<{ label: string; value: string | number }>;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`group relative rounded-3xl border border-slate-200 dark:border-transparent bg-white dark:bg-[#1A1A1E] dark:bg-gradient-to-br dark:${gradientColor} px-6 pt-5 pb-6 backdrop-blur-none dark:backdrop-blur-md overflow-hidden card-hover`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] to-transparent pointer-events-none" />
      
      <div className="relative flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl bg-[#F8FAFC] dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-transparent flex items-center justify-center shadow-sm`}>
                <Icon className={`h-5 w-5 ${colorClass}`} />
              </div>
              <div className="text-left">
                <h3 className="text-base font-heading font-bold text-[#1E293B] dark:text-foreground leading-tight">{name}</h3>
                <p className="text-[11px] text-muted-foreground font-mono font-medium mt-0.5 max-w-[120px] truncate" title={isConnected ? username : undefined}>
                  {isConnected ? `@${username}` : "Not Connected"}
                </p>
              </div>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-tight shrink-0 ${
              isConnected 
                ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400" 
                : "bg-slate-50 dark:bg-slate-900/30 border border-slate-150 dark:border-white/5 text-slate-500 dark:text-muted-foreground"
            }`}>
              {isConnected ? "CONNECTED" : "NOT CONNECTED"}
            </div>
          </div>

          <div className="mb-6 text-center">
            <p className="text-[10px] text-[#64748B] dark:text-muted-foreground uppercase tracking-[0.2em] font-mono font-black mb-1">
              {mainStat.label}
            </p>
            <p className={`text-5xl font-black font-heading ${colorClass} tracking-tighter`}>
              {mainStat.value}
            </p>
          </div>
        </div>

        <div className={`grid ${gridStats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 mt-auto`}>
          {gridStats.map((stat, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-white/5 backdrop-blur-none dark:backdrop-blur-sm card-hover min-h-[56px]"
            >
              <span className={`text-[15px] font-black font-heading ${colorClass} truncate w-full text-center`} title={stat.value.toString()}>
                {stat.value}
              </span>
              <span className="text-[8px] text-[#64748B] dark:text-muted-foreground uppercase tracking-wider font-mono font-bold mt-1 text-center leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function PlatformCards({ 
  leetcodeStats, 
  codeforcesStats, 
  codechefStats 
}: { 
  leetcodeStats?: PlatformStats;
  codeforcesStats?: PlatformStats;
  codechefStats?: PlatformStats;
}) {
  const isLcConnected = !!leetcodeStats?.username;
  const isCfConnected = !!codeforcesStats?.username;
  const isCcConnected = !!codechefStats?.username;

  const platforms = [
    {
      name: "LeetCode",
      icon: Hash,
      colorClass: "text-leetcode",
      gradientColor: "from-leetcode/20 to-leetcode/5",
      username: leetcodeStats?.username || "",
      isConnected: isLcConnected,
      mainStat: {
        label: "Problems Solved",
        value: isLcConnected ? (leetcodeStats?.problemsSolved || 0) : 0
      },
      gridStats: [
        { label: "Contest Rating", value: isLcConnected ? Math.round(leetcodeStats?.contestRating || 0) : 0 },
        { label: "Ranking", value: isLcConnected ? (leetcodeStats?.ranking || 0) : 0 }
      ],
      delay: 0.4
    },
    {
      name: "Codeforces",
      icon: TrendingUp,
      colorClass: "text-codeforces",
      gradientColor: "from-codeforces/20 to-codeforces/5",
      username: codeforcesStats?.username || "",
      isConnected: isCfConnected,
      mainStat: {
        label: "Current Rating",
        value: isCfConnected ? (codeforcesStats?.currentRating || 0) : 0
      },
      gridStats: [
        { label: "Max Rating", value: isCfConnected ? (codeforcesStats?.maxRating || 0) : 0 },
        { label: "Rank", value: isCfConnected ? (codeforcesStats?.rank || "Not Connected") : "Not Connected" },
        { label: "Contest Count", value: isCfConnected ? (codeforcesStats?.contestCount || 0) : 0 }
      ],
      delay: 0.5
    },
    {
      name: "CodeChef",
      icon: Award,
      colorClass: "text-codechef",
      gradientColor: "from-codechef/20 to-codechef/5",
      username: codechefStats?.username || "",
      isConnected: isCcConnected,
      mainStat: {
        label: "Current Rating",
        value: isCcConnected ? (codechefStats?.currentRating || 0) : 0
      },
      gridStats: [
        { label: "Stars", value: isCcConnected ? (codechefStats?.stars || "0") : "0" },
        { label: "Contests", value: isCcConnected ? (codechefStats?.contestCount || 0) : 0 }
      ],
      delay: 0.6
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {platforms.map((p) => (
        <PlatformCard key={p.name} {...p} />
      ))}
    </div>
  );
}
