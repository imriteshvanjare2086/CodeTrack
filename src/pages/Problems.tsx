import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { useContests } from "@/hooks/useContests";
import { ContestCountdown } from "@/components/problems/ContestCountdown";
import { ExternalLink, Flame, Trophy, Calendar, Code, Clock, Search, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Problems() {
  const [activeTab, setActiveTab] = useState<"problems" | "contests">("problems");

  // Contests tab states
  const [contestPlatform, setContestPlatform] = useState<"all" | "leetcode" | "codeforces" | "codechef">("all");
  const [contestSearch, setContestSearch] = useState("");

  const { data: contests, isLoading, isError, refetch } = useContests();
  const problemPages = [
    {
      platform: "leetcode",
      name: "LeetCode",
      title: "LeetCode Problemset",
      description: "Open the full LeetCode problem page.",
      url: "https://leetcode.com/problemset/all/",
    },
    {
      platform: "codeforces",
      name: "Codeforces",
      title: "Codeforces Problemset",
      description: "Open the full Codeforces problem page.",
      url: "https://codeforces.com/problemset",
    },
    {
      platform: "codechef",
      name: "CodeChef",
      title: "CodeChef Practice",
      description: "Open the full CodeChef practice page.",
      url: "https://www.codechef.com/practice",
    },
  ];
  const contestPages = [
    {
      platform: "leetcode",
      name: "LeetCode",
      title: "LeetCode Contests",
      description: "Weekly, biweekly, and archived LeetCode contests.",
      url: "https://leetcode.com/contest/",
    },
    {
      platform: "codeforces",
      name: "Codeforces",
      title: "Codeforces Contests",
      description: "Official contest calendar with upcoming and past rounds.",
      url: "https://codeforces.com/contests",
    },
    {
      platform: "codechef",
      name: "CodeChef",
      title: "CodeChef Contests",
      description: "Current, future, and past CodeChef contests.",
      url: "https://www.codechef.com/contests",
    },
  ];

  // Filter contests based on platform & search
  const filteredContests = useMemo(() => {
    if (!contests) return { live: [], upcoming: [], past: [] };

    const filterFn = (c: any) => {
      const matchesPlatform = contestPlatform === "all" || c.platform === contestPlatform;
      const matchesSearch = c.title.toLowerCase().includes(contestSearch.toLowerCase());
      return matchesPlatform && matchesSearch;
    };

    return {
      live: (contests.live || []).filter(filterFn),
      upcoming: (contests.upcoming || []).filter(filterFn),
      past: (contests.past || []).filter(filterFn),
    };
  }, [contests, contestPlatform, contestSearch]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs} hrs ${mins > 0 ? `${mins} mins` : ""}`;
    return `${mins} mins`;
  };

  const getPlatformStyle = (p: string) => {
    switch (p) {
      case "leetcode":
        return {
          badge: "text-[#FFA116] border-[#FFA116]/30 bg-[#FFA116]/15 shadow-[0_0_20px_rgba(255,161,22,0.15)]",
          text: "text-[#FFA116]",
          bg: "from-[#FFA116]/10 to-[#FFA116]/0",
          border: "border-[#FFA116]/20 hover:border-[#FFA116]/40",
          icon: <Flame className="h-4 w-4 mr-1 text-[#FFA116]" />,
        };
      case "codeforces":
        return {
          badge: "text-[#188AD2] border-[#188AD2]/30 bg-[#188AD2]/15 shadow-[0_0_20px_rgba(24,138,210,0.15)]",
          text: "text-[#188AD2]",
          bg: "from-[#188AD2]/10 to-[#188AD2]/0",
          border: "border-[#188AD2]/20 hover:border-[#188AD2]/40",
          icon: <Trophy className="h-4 w-4 mr-1 text-[#188AD2]" />,
        };
      case "codechef":
        return {
          badge: "text-[#8B4513] border-[#8B4513]/30 bg-[#8B4513]/15 shadow-[0_0_20px_rgba(139,69,19,0.2)]",
          text: "text-[#8B4513]",
          bg: "from-[#8B4513]/10 to-[#8B4513]/0",
          border: "border-[#8B4513]/20 hover:border-[#8B4513]/40",
          icon: <Code2 className="h-4 w-4 mr-1 text-[#8B4513]" />,
        };
      default:
        return {
          badge: "text-muted-foreground border-white/10 bg-white/10",
          text: "text-foreground",
          bg: "from-white/10 to-transparent",
          border: "border-white/10 hover:border-white/20",
          icon: <Code className="h-4 w-4 mr-1" />,
        };
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500">
        <PageHeader 
          title="Problems & Contests" 
          description="Solve challenges directly on top coding platforms or track live and upcoming contests with real-time countdown clocks." 
        />

        {/* Tab Selection */}
        <div className="flex space-x-1.5 p-1 rounded-2xl bg-muted/20 border border-white/5 max-w-md">
          <button
            onClick={() => setActiveTab("problems")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold tracking-tight rounded-xl transition-all duration-300 ${
              activeTab === "problems"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/15"
            }`}
          >
            <Code className="h-4 w-4" />
            Solve Problems
          </button>
          <button
            onClick={() => setActiveTab("contests")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold tracking-tight rounded-xl transition-all duration-300 ${
              activeTab === "contests"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/15"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Contest Calendar
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "problems" ? (
            <motion.div
              key="problems-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass rounded-3xl p-8 space-y-8 relative overflow-hidden premium-border shadow-xl">
                <div className="space-y-2">
                  <h3 className="text-2xl font-heading font-black tracking-tight text-foreground">
                    Problem Pages
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xl">
                    Choose a platform and jump straight to its official problem page.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {problemPages.map((page) => {
                    const pStyle = getPlatformStyle(page.platform);

                    return (
                      <div
                        key={page.platform}
                        className={`glass-strong rounded-2xl p-6 border ${pStyle.border} bg-[#252535] flex flex-col justify-between gap-6 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                      >
                        <div className="space-y-4">
                          <Badge className={`${pStyle.badge} px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest`}>
                            {pStyle.icon}
                            {page.name}
                          </Badge>

                          <div className="space-y-2">
                            <h4 className="font-heading text-lg font-black tracking-tight text-white">{page.title}</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">{page.description}</p>
                          </div>
                        </div>

                        <Button
                          asChild
                          variant="premium"
                          className="h-12 w-full justify-center gap-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all"
                        >
                          <a href={page.url} target="_blank" rel="noreferrer">
                            Problem Page
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="contests-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass rounded-3xl p-6 space-y-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-heading font-black tracking-tight text-foreground">
                      Contest Schedule
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Scan live, upcoming, and recently concluded contests across platforms.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search contests..."
                        value={contestSearch}
                        onChange={(e) => setContestSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/5 bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-muted/10 border border-white/5">
                      {(["all", "leetcode", "codeforces", "codechef"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setContestPlatform(p)}
                          className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
                            contestPlatform === p
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                          }`}
                        >
                          {p === "all" ? "All" : p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Loader / Error Handling */}
              {isLoading && (
                <div className="glass rounded-3xl p-20 flex flex-col items-center justify-center space-y-4">
                  <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-mono text-muted-foreground">Syncing platform contest schedules...</p>
                </div>
              )}

              {isError && (
                <div className="glass rounded-3xl p-16 text-center space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 text-xl font-bold">⚠️</div>
                  <h3 className="text-lg font-bold font-heading">Failed to sync contest calendars</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    We had trouble fetching live details from Codeforces, LeetCode, or CodeChef. Check your network and try again.
                  </p>
                  <Button onClick={() => refetch()} variant="outline">Retry Sync</Button>
                </div>
              )}

              {/* Contest Display */}
              {!isLoading && !isError && (
                <div className="space-y-8">
                  {/* Live Contests (only show if any exist) */}
                  {filteredContests.live.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                          </span>
                          <h4 className="font-heading font-black tracking-tight text-foreground uppercase text-xs">Live Contests</h4>
                        </div>
                        <Badge variant="outline" className="font-mono text-[9px] bg-rose-500/5 text-rose-400 border-rose-500/10">
                          {filteredContests.live.length}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredContests.live.map((c) => {
                          const pStyle = getPlatformStyle(c.platform);
                          return (
                            <a 
                              key={c.id} 
                              href={c.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className={`glass-strong rounded-2xl p-5 border ${pStyle.border} space-y-4 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl bg-[#252535] block`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2">
                                  <h5 className="font-heading font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2 text-white">
                                    {c.title}
                                  </h5>
                                </div>
                                <Badge className={`${pStyle.badge} px-2.5 py-1 text-xs`}>
                                  {pStyle.icon}
                                  {c.platform}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground/90 pt-3 border-t border-white/10">
                                <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {formatDuration(c.duration)}</span>
                                <span className="font-bold uppercase tracking-wider text-rose-400 text-sm">
                                  Live Now
                                </span>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Upcoming Contests (full width) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <h4 className="font-heading font-black tracking-tight text-foreground uppercase text-xs">Upcoming Contests</h4>
                      </div>
                      <Badge variant="outline" className="font-mono text-[9px] bg-primary/5 text-primary border-primary/10">
                        {filteredContests.upcoming.length}
                      </Badge>
                    </div>

                    {filteredContests.upcoming.length === 0 ? (
                      <div className="glass rounded-2xl p-8 text-center text-xs text-muted-foreground border border-white/5">
                        No upcoming contests scheduled.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredContests.upcoming.map((c) => {
                          const pStyle = getPlatformStyle(c.platform);
                          const timeUntilStart = c.startTime - Date.now();
                          const startsWithin24Hours = timeUntilStart > 0 && timeUntilStart < 24 * 60 * 60 * 1000;
                          
                          return (
                            <a 
                              key={c.id} 
                              href={c.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className={`glass-strong rounded-2xl p-5 border ${pStyle.border} flex flex-col justify-between gap-4 group hover:scale-[1.02] transition-all duration-300 relative hover:shadow-xl bg-[#252535] block`}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Badge className={`${pStyle.badge} px-2.5 py-1 text-xs`}>
                                    {pStyle.icon}
                                    {c.platform}
                                  </Badge>
                                  {startsWithin24Hours && (
                                    <Badge className="text-orange-400 border-orange-400/30 bg-orange-400/10 font-black text-xs px-2.5 py-1 rounded-lg">
                                      🔥 Starting Soon
                                    </Badge>
                                  )}
                                </div>

                                <h5 className="font-heading font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2 text-white">
                                  {c.title}
                                </h5>
                              </div>

                              <div className="space-y-2 pt-3 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-[11px] font-mono text-muted-foreground/90 uppercase tracking-widest mb-1">Starts In</span>
                                    <ContestCountdown startTime={c.startTime} />
                                  </div>
                                  <div className="text-right">
                                    <div className="text-[11px] font-mono text-muted-foreground/90 uppercase tracking-widest mb-1">
                                      {new Date(c.startTime).toLocaleDateString([], { month: "short", day: "numeric" })} @ {new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                                    </div>
                                    <span className="text-sm font-black text-white">
                                      {formatDuration(c.duration)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}


            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
