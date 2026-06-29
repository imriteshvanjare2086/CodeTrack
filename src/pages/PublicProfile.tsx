import { useParams, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { PlatformCards } from "@/components/dashboard/PlatformCards";
import { ProfileOverviewCard } from "@/components/ProfileOverviewCard";
import { useDashboard } from "@/hooks/useDashboard";
import { Activity } from "lucide-react";

export default function PublicProfile() {
  const { userId } = useParams();
  const localUser = JSON.parse(localStorage.getItem("user") || "null");
  const isOwnProfile = !userId || userId === localUser?._id;

  const { data: dash, isLoading, isError } = useDashboard(userId);

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
    </DashboardLayout>
  );
}
