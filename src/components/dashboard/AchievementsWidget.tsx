import { Link } from "react-router-dom";
import { ArrowRight, Award, Lock, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import type { DashboardData } from "@/hooks/useDashboard";
import { BadgeArtwork } from "@/components/achievements/AchievementBadge";
import {
  formatAchievementDate,
  getAchievementStats,
  getRecentAchievements,
  useAchievements,
} from "@/lib/achievements";

export function AchievementsWidget({ data }: { data?: DashboardData }) {
  const achievements = useAchievements(data);
  const stats = getAchievementStats(achievements);
  const recent = getRecentAchievements(achievements, 3);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] px-6 py-6 md:px-8 backdrop-blur-none dark:backdrop-blur-3xl shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.08)] ring-0 dark:ring-1 dark:ring-white/5 relative overflow-hidden premium-border card-hover"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-primary/5 pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10">
              <Trophy className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-heading text-2xl font-black tracking-tight text-foreground">Achievements</h3>
              <p className="font-mono text-xs text-muted-foreground">Recently unlocked badges</p>
            </div>
          </div>

          <Link
            to="/achievements"
            className="flex items-center gap-1 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {recent.map((achievement) => (
              <Link
                key={achievement.id}
                to="/achievements"
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:-translate-y-1 hover:bg-white/[0.06] hover:shadow-xl"
              >
                <BadgeArtwork achievement={achievement} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-heading text-sm font-black text-foreground group-hover:text-primary">{achievement.title}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{formatAchievementDate(achievement.earnedDate)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/50 bg-muted/5 p-6 text-center">
            <Award className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-2 font-mono text-xs text-muted-foreground">Connect platforms to start unlocking badges.</p>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatPill icon={<Trophy className="h-4 w-4" />} label="Completed" value={stats.earned} />
          <StatPill icon={<Lock className="h-4 w-4" />} label="Locked" value={stats.locked} />
          <StatPill icon={<Award className="h-4 w-4" />} label="Completion" value={`${stats.completion}%`} />
        </div>
      </div>
    </motion.section>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="mt-1 font-heading text-2xl font-black text-foreground">{value}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
