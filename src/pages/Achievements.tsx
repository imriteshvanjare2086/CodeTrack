import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Achievement,
  getRecentAchievements,
  useAchievements,
} from "@/lib/achievements";
import {
  PremiumBadge,
  BadgeDetailModal,
  BadgeGalleryModal,
} from "@/components/dashboard/PremiumBadge";
import { Trophy, Target, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Achievements() {
  const { data: dashboard, isLoading } = useDashboard();
  const achievements = useAchievements(dashboard);
  const recent = getRecentAchievements(achievements, 3);
  const earned = achievements.filter((a) => a.earned);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  const sortedEarned = useMemo(() => {
    const rarityOrder = {
      Common: 1,
      Uncommon: 2,
      Rare: 3,
      Epic: 4,
      Legendary: 5,
    };
    return [...earned].sort((a, b) => {
      const rA = rarityOrder[a.rarity as keyof typeof rarityOrder] || 1;
      const rB = rarityOrder[b.rarity as keyof typeof rarityOrder] || 1;
      if (rA !== rB) return rA - rB;
      return a.targetProgress - b.targetProgress;
    });
  }, [earned]);

  const pendingTasks = useMemo(() => {
    const grouped: Record<string, Achievement[]> = {};
    achievements.forEach((a) => {
      if (a.earned) return;
      let key: string = a.category;
      if (a.platform) {
        key = `${a.category}-${a.platform}`;
      }
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(a);
    });

    const closest = Object.values(grouped).map((group) => {
      return group.sort((a, b) => {
        if (b.percent !== a.percent) return b.percent - a.percent;
        return a.remaining - b.remaining;
      })[0];
    });

    const rarityOrder = {
      Common: 1,
      Uncommon: 2,
      Rare: 3,
      Epic: 4,
      Legendary: 5,
    };

    return closest.filter(Boolean).sort((a, b) => {
      const rA = rarityOrder[a.rarity as keyof typeof rarityOrder] || 1;
      const rB = rarityOrder[b.rarity as keyof typeof rarityOrder] || 1;
      if (rA !== rB) return rA - rB;
      return a.remaining - b.remaining;
    });
  }, [achievements]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="glass rounded-3xl p-12 text-center max-w-6xl mx-auto">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 font-mono text-sm text-muted-foreground">
            Loading achievements...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 py-8 px-4">
        <PageHeader
          title="Achievements"
          description="Track your progress and unlock badges"
        />

        {/* Badge Summary Section */}
        <section className="glass rounded-3xl border border-border/50 dark:border-white/10 p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Trophy className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-black font-heading text-foreground">Badge Summary</h2>
            </div>
            <button
              onClick={() => setShowGallery(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/15 transition-all text-sm font-bold text-foreground cursor-pointer"
            >
              View All
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left space-y-5">
              <div>
                <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Badges</p>
                <p className="text-5xl font-black font-heading text-foreground mt-1">
                  {earned.length}
                </p>
              </div>
              {recent.length > 0 && (
                <div className="space-y-1 font-mono text-left pt-3 border-t border-slate-100 dark:border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Most Recent Badge</p>
                  <p className="text-sm text-primary font-bold">{recent[0].title}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-end gap-4 md:gap-6">
              {recent.length > 0 && recent[2] && (
                <div className="scale-90 opacity-80">
                  <PremiumBadge
                    achievement={recent[2]}
                    size="lg"
                    onClick={() => setSelectedBadge(recent[2])}
                  />
                </div>
              )}
              {recent.length > 0 && recent[0] && (
                <div className="scale-110 z-10 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                  <PremiumBadge
                    achievement={recent[0]}
                    size="xl"
                    onClick={() => setSelectedBadge(recent[0])}
                  />
                </div>
              )}
              {recent.length > 1 && recent[1] && (
                <div className="scale-90 opacity-80">
                  <PremiumBadge
                    achievement={recent[1]}
                    size="lg"
                    onClick={() => setSelectedBadge(recent[1])}
                  />
                </div>
              )}
              {recent.length === 0 &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-28 w-28 rounded-full border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01]",
                      i === 1 && "h-32 w-32"
                    )}
                  />
                ))}
            </div>
          </div>
        </section>

        {/* Completed & Pending Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-black font-heading flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Completed Tasks
            </h2>
            <div className="glass rounded-3xl border border-border/50 dark:border-white/10 p-6 min-h-[400px]">
              {earned.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  No achievements yet. Keep coding!
                </p>
              ) : (
                <div className="space-y-3">
                  {sortedEarned.slice(0, 12).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg px-2 transition-all"
                      onClick={() => setSelectedBadge(a)}
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground font-medium">
                        {a.requirement}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black font-heading flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Pending Tasks
            </h2>
            <div className="glass rounded-3xl border border-border/50 dark:border-white/10 p-6 min-h-[400px]">
              {pendingTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  All milestones reached! Great job!
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.filter(Boolean).map((a) => (
                    <div
                      key={(a as Achievement).id}
                      className="flex items-center gap-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg px-2 transition-all"
                      onClick={() => setSelectedBadge(a)}
                    >
                      <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground font-medium">
                        {(a as Achievement).requirement}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <BadgeGalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        achievements={achievements}
        onBadgeClick={(achievement) => {
          setShowGallery(false);
          setSelectedBadge(achievement);
        }}
      />

      <BadgeDetailModal
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        achievement={selectedBadge}
      />
    </DashboardLayout>
  );
}
