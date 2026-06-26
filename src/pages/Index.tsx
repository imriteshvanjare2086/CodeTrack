import { DashboardLayout } from "@/components/DashboardLayout";
import { Activity, Link2, RefreshCw, Info } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { PlatformCards } from "@/components/dashboard/PlatformCards";
import { RatingGraph } from "@/components/dashboard/RatingGraph";

import { useParams } from "react-router-dom";
import { useDashboard } from "@/hooks/useDashboard";
import { WebsiteTour } from "@/components/WebsiteTour";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/apiClient";
import { motion } from "framer-motion";

const Index = () => {
  const { userId } = useParams();
  const { data: dash, isLoading, refetch } = useDashboard(userId);
  const isOwnDashboard = !userId;
  const { toast } = useToast();
  const [showTour, setShowTour] = useState(false);

  const [leetcodeInput, setLeetcodeInput] = useState("");
  const [codeforcesInput, setCodeforcesInput] = useState("");
  const [codechefInput, setCodechefInput] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (dash?.profile) {
      setLeetcodeInput(dash.profile.leetcodeUsername || "");
      setCodeforcesInput(dash.profile.codeforcesUsername || "");
      setCodechefInput(dash.profile.codechefUsername || "");
    }
  }, [dash?.profile]);

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

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      const res = await api.post("/user/sync-platforms", {
        leetcodeUsername: leetcodeInput,
        codeforcesUsername: codeforcesInput,
        codechefUsername: codechefInput,
      });
      await refetch();
      toast({
        title: "Sync Successful",
        description: res.data.message || "Successfully synchronized coding profiles.",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Sync Failed",
        description: err.response?.data?.message || "Failed to sync coding profiles.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
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

  const isConnected = !!(dash?.profile?.leetcodeUsername || dash?.profile?.codeforcesUsername || dash?.profile?.codechefUsername);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-5">
        <PageHeader
          title={isOwnDashboard ? "Dashboard" : `${dash?.profile?.username}'s Dashboard`}
          description={isOwnDashboard ? "Track your competitive programming journey" : `Viewing ${dash?.profile?.username}'s coding profile and history`}
        />

        {isOwnDashboard && !isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-sm font-sans"
          >
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="flex-1 text-left">
              <p className="font-semibold leading-none">Profile Connection Required</p>
              <p className="text-xs text-amber-700/85 dark:text-amber-400/80 mt-1">
                Connect your coding profiles to sync your progress.
              </p>
            </div>
          </motion.div>
        )}

        <div id="tour-stats">
          <HeroStats stats={dash?.heroStats} />
        </div>

        {isOwnDashboard && (
          <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] px-6 pt-6 pb-6 md:px-8 md:pt-6 md:pb-7 shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden card-hover group/connection text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-black text-[#1E293B] dark:text-foreground tracking-tight">Connect Coding Profiles</h3>
                  <p className="text-sm text-[#64748B] dark:text-muted-foreground font-mono mt-0.5 flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                    Link your profiles to automatically synchronize statistics
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {/* LeetCode Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-leetcode" />
                  LeetCode Username
                </label>
                <input
                  type="text"
                  placeholder="LeetCode Username"
                  value={leetcodeInput}
                  onChange={(e) => setLeetcodeInput(e.target.value)}
                  disabled={isSyncing}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1E] text-[#1E293B] dark:text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans text-sm"
                />
              </div>

              {/* Codeforces Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-codeforces" />
                  Codeforces Username
                </label>
                <input
                  type="text"
                  placeholder="Codeforces Username"
                  value={codeforcesInput}
                  onChange={(e) => setCodeforcesInput(e.target.value)}
                  disabled={isSyncing}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1E] text-[#1E293B] dark:text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans text-sm"
                />
              </div>

              {/* CodeChef Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-codechef" />
                  CodeChef Username
                </label>
                <input
                  type="text"
                  placeholder="CodeChef Username"
                  value={codechefInput}
                  onChange={(e) => setCodechefInput(e.target.value)}
                  disabled={isSyncing}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1E] text-[#1E293B] dark:text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans text-sm"
                />
              </div>
            </div>

            <div className="relative z-10 flex justify-end">
              <button
                onClick={handleSyncData}
                disabled={isSyncing}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-black text-sm uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer shadow-md"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Syncing..." : "Sync Data"}
              </button>
            </div>
          </div>
        )}

        <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] px-6 pt-3 pb-6 md:px-8 md:pt-4 md:pb-7 backdrop-blur-none dark:backdrop-blur-3xl shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] ring-0 dark:ring-1 dark:ring-white/5 relative overflow-hidden premium-border space-y-6 mt-4 card-hover group/platform">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none group-hover/platform:opacity-70 transition-opacity" />
          
          <div className="relative z-10 flex items-center gap-4 mb-4 text-left">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-black text-foreground tracking-tight text-left">Platform Performance</h3>
              <p className="text-sm text-muted-foreground font-mono mt-0.5 flex items-center gap-2 text-left">
                <span className="flex h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                Detailed breakdown across coding platforms
              </p>
            </div>
          </div>
          
          <div className="relative z-10" id="tour-platforms">
            <PlatformCards 
              leetcodeStats={dash?.leetcodeStats}
              codeforcesStats={dash?.codeforcesStats}
              codechefStats={dash?.codechefStats}
            />
          </div>
        </div>
      </div>
      {showTour && <WebsiteTour onComplete={handleTourComplete} />}
    </DashboardLayout>
  );
};

export default Index;
