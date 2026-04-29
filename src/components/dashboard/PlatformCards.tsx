import { motion } from "framer-motion";
import { useDashboard } from "@/hooks/useDashboard";
import { Star, TrendingUp, Award, Hash } from "lucide-react";

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-white/5 backdrop-blur-none dark:backdrop-blur-sm card-hover">
      <span className={`text-2xl font-black font-heading ${color}`}>{value}</span>
      <span className="text-[10px] text-[#64748B] dark:text-muted-foreground uppercase tracking-widest font-mono font-bold mt-1">{label}</span>
    </div>
  );
}

function PlatformCard({ 
  name, 
  icon: Icon, 
  colorClass, 
  borderColor, 
  gradientColor, 
  stats, 
  delay 
}: { 
  name: string; 
  icon: any; 
  colorClass: string; 
  borderColor: string; 
  gradientColor: string; 
  stats: { solved: number; rating: number; contests: number };
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`group relative rounded-3xl border border-slate-200 dark:border-transparent bg-white dark:bg-[#1A1A1E] dark:bg-gradient-to-br dark:${gradientColor} px-6 pt-3 pb-6 backdrop-blur-none dark:backdrop-blur-md overflow-hidden card-hover`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] to-transparent pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl bg-[#F8FAFC] dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-transparent flex items-center justify-center shadow-sm`}>
              <Icon className={`h-5 w-5 ${colorClass}`} />
            </div>
            <h3 className="text-base font-heading font-bold text-[#1E293B] dark:text-foreground">{name}</h3>
          </div>
          <div className={`px-2 py-1 rounded-full bg-emerald-50 dark:bg-slate-900/30 border border-emerald-100 dark:border-transparent text-[10px] font-mono ${colorClass} font-bold`}>
            ACTIVE
          </div>
        </div>

        <div className="mb-8 text-center">
          <p className="text-[11px] text-[#64748B] dark:text-muted-foreground uppercase tracking-[0.2em] font-mono font-black mb-1">Total Problems Solved</p>
          <p className={`text-6xl font-black font-heading ${colorClass} tracking-tighter`}>
            {stats.solved}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatBox label="Contest Rating" value={stats.rating} color={colorClass} />
          <StatBox label="Total Contests" value={stats.contests} color={colorClass} />
        </div>
      </div>
    </motion.div>
  );
}

export function PlatformCards({ stats }: { stats?: any }) {
  const platforms = [
    {
      name: "LeetCode",
      icon: Hash,
      colorClass: "text-leetcode",
      borderColor: "border-leetcode/20",
      gradientColor: "from-leetcode/20 to-leetcode/5",
      stats: {
        solved: stats?.leetcode || 250,
        rating: stats?.leetcodeRating || 1982,
        contests: stats?.leetcodeContests || 45
      },
      delay: 0.4
    },
    {
      name: "Codeforces",
      icon: TrendingUp,
      colorClass: "text-codeforces",
      borderColor: "border-codeforces/20",
      gradientColor: "from-codeforces/20 to-codeforces/5",
      stats: {
        solved: stats?.codeforces || 120,
        rating: stats?.codeforcesRating || 1650,
        contests: stats?.codeforcesContests || 28
      },
      delay: 0.5
    },
    {
      name: "CodeChef",
      icon: Award,
      colorClass: "text-codechef",
      borderColor: "border-codechef/20",
      gradientColor: "from-codechef/20 to-codechef/5",
      stats: {
        solved: stats?.codechef || 112,
        rating: stats?.codechefRating || 1820,
        contests: stats?.codechefContests || 38
      },
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
