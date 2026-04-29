import { DashboardLayout } from "@/components/DashboardLayout";
import { Activity } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { ContributionGraph } from "@/components/dashboard/ContributionGraph";
import { PlatformCards } from "@/components/dashboard/PlatformCards";
import { RatingGraph } from "@/components/dashboard/RatingGraph";

import { useParams } from "react-router-dom";
import { useDashboard } from "@/hooks/useDashboard";
import { WebsiteTour } from "@/components/WebsiteTour";
import { useState, useEffect } from "react";

const Index = () => {
  const { userId } = useParams();
  const { data: dash, isLoading } = useDashboard(userId);
  const isOwnDashboard = !userId;
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("codetrack_tour_done");
    if (!hasSeenTour && isOwnDashboard) {
      // Start tour after a delay regardless of data loading to prevent spinner blocking
      const timer = setTimeout(() => setShowTour(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOwnDashboard, isLoading]);

  const handleTourComplete = () => {
    localStorage.setItem("codetrack_tour_done", "true");
    setShowTour(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        {showTour && <WebsiteTour onComplete={handleTourComplete} />}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-5">
        <PageHeader
          title={isOwnDashboard ? "Dashboard" : `${dash?.profile?.username}'s Dashboard`}
          description={isOwnDashboard ? "Track your competitive programming journey" : `Viewing ${dash?.profile?.username}'s coding profile and history`}
        />
        <div id="tour-stats">
          <HeroStats stats={dash?.heroStats} />
        </div>
        <ContributionGraph stats={dash?.heroStats} />
        <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] px-6 pt-3 pb-6 md:px-8 md:pt-4 md:pb-7 backdrop-blur-none dark:backdrop-blur-3xl shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] ring-0 dark:ring-1 dark:ring-white/5 relative overflow-hidden premium-border space-y-6 mt-4 card-hover group/platform">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none group-hover/platform:opacity-70 transition-opacity" />
          
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-black text-foreground tracking-tight">Platform Performance</h3>
              <p className="text-sm text-muted-foreground font-mono mt-0.5 flex items-center gap-2">
                <span className="flex h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                Detailed breakdown across coding platforms
              </p>
            </div>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div id="tour-platforms">
              <PlatformCards stats={dash?.profile?.platformStats} />
            </div>
            <div className="w-full pt-4 border-t border-foreground/10">
              <RatingGraph userId={userId} />
            </div>
          </div>
        </div>
      </div>
      {showTour && <WebsiteTour onComplete={handleTourComplete} />}
    </DashboardLayout>
  );
};

export default Index;
