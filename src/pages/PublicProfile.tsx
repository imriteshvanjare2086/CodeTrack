import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { PlatformCards } from "@/components/dashboard/PlatformCards";
import { ProfileOverviewCard } from "@/components/ProfileOverviewCard";
import { PremiumBadge, BadgeDetailModal, BadgeGalleryModal } from "@/components/dashboard/PremiumBadge";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Achievement,
  getRecentAchievements,
  useAchievements,
} from "@/lib/achievements";
import { cn } from "@/lib/utils";
import { Activity, ExternalLink, Trophy } from "lucide-react";

export default function PublicProfile() {
  const { userId } = useParams();
  const localUser = JSON.parse(localStorage.getItem("user") || "null");
  const isOwnProfile = !userId || userId === localUser?._id;
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const { data: dash, isLoading, isError } = useDashboard(userId);
  const achievements = useAchievements(dash);
  const recent = getRecentAchievements(achievements, 3);
  const earned = achievements.filter((achievement) => achievement.earned);

  if (isOwnProfile) {
    return <Navigate to="/profile" replace />;
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !dash) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-6xl py-20 text-center font-mono text-sm text-muted-foreground">
          Could not load this profile.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-5 pb-20">
        <PageHeader
          title={`${dash.profile.username}'s Profile`}
          description="Public performance overview based on live platform statistics."
        />

        <ProfileOverviewCard user={dash.profile} />

        <HeroStats stats={dash.heroStats} />

        <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] p-8 backdrop-blur-none dark:backdrop-blur-3xl shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] ring-0 dark:ring-1 dark:ring-white/5 relative overflow-visible premium-border card-hover mt-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Trophy className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-black font-heading text-foreground">Badge Summary</h2>
            </div>
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/15 transition-all text-sm font-bold text-foreground dark:text-white cursor-pointer"
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
                      "h-28 w-28 rounded-full border border-dashed border-white/10 bg-white/[0.01]",
                      i === 1 && "h-32 w-32"
                    )}
                  />
                ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] px-6 pt-3 pb-6 md:px-8 md:pt-4 md:pb-7 backdrop-blur-none dark:backdrop-blur-3xl shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] ring-0 dark:ring-1 dark:ring-white/5 relative overflow-hidden premium-border space-y-6 mt-4 card-hover group/platform">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none group-hover/platform:opacity-70 transition-opacity" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-black text-foreground tracking-tight text-left">
                  {dash.profile.username}'s Platform Performance
                </h3>
                <p className="text-sm text-muted-foreground font-mono mt-0.5 flex items-center gap-2 text-left">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Read-only public platform data
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <PlatformCards
              readOnly
              leetcodeStats={dash.leetcodeStats}
              codeforcesStats={dash.codeforcesStats}
              codechefStats={dash.codechefStats}
            />
          </div>
        </div>
      </div>
      <BadgeDetailModal
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        achievement={selectedBadge}
      />
      <BadgeGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        achievements={achievements}
        onBadgeClick={(achievement) => setSelectedBadge(achievement)}
      />
    </DashboardLayout>
  );
}
