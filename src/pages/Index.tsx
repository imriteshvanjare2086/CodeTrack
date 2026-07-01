import { DashboardLayout } from "@/components/DashboardLayout";
import { Activity, Link2, RefreshCw, Info, Clock, Search, Hash, TrendingUp, Trophy, ExternalLink, X, Award } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { PlatformCards } from "@/components/dashboard/PlatformCards";
import { RatingGraph } from "@/components/dashboard/RatingGraph";
import { useDashboard } from "@/hooks/useDashboard";
import { useAchievements, getRecentAchievements } from "@/lib/achievements";
import { PremiumBadge, BadgeDetailModal, BadgeGalleryModal } from "@/components/dashboard/PremiumBadge";

import { useParams } from "react-router-dom";
import { WebsiteTour } from "@/components/WebsiteTour";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";



// ── Recent-username history helpers (localStorage, max 5 per platform) ────────
const HISTORY_KEY = (p: string) => `codetrack_recent_${p}`;

function getHistory(platform: string): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY(platform)) || "[]"); }
  catch { return []; }
}

function pushHistory(platform: string, username: string) {
  if (!username.trim()) return;
  const prev = getHistory(platform).filter((u) => u !== username);
  localStorage.setItem(HISTORY_KEY(platform), JSON.stringify([username, ...prev].slice(0, 5)));
}

function clearHistory(platform: string) {
  localStorage.removeItem(HISTORY_KEY(platform));
}

// ── Lookup search history helpers ────────────────────────────────────────────
const LOOKUP_HISTORY_KEY = (p: string) => `codetrack_lookup_recent_${p}`;

function getLookupHistory(platform: string): string[] {
  try { return JSON.parse(localStorage.getItem(LOOKUP_HISTORY_KEY(platform)) || "[]"); }
  catch { return []; }
}

function pushLookupHistory(platform: string, username: string) {
  if (!username.trim()) return;
  const prev = getLookupHistory(platform).filter((u) => u !== username);
  localStorage.setItem(LOOKUP_HISTORY_KEY(platform), JSON.stringify([username, ...prev].slice(0, 5)));
}

function clearLookupHistory(platform: string) {
  localStorage.removeItem(LOOKUP_HISTORY_KEY(platform));
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Standalone UsernameInput component ───────────────────────────────────────
interface UsernameInputProps {
  platform: string;
  label: string;
  colorClass: string;
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
  onHistoryChange: () => void;
}

function UsernameInput({ platform, label, colorClass, value, disabled, onChange, onHistoryChange }: UsernameInputProps) {
  const [open, setOpen] = useState(false);
  const history = getHistory(platform);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="space-y-2 text-left relative">
      <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${colorClass}`} />
        {label}
      </label>

      <input
        type="text"
        placeholder={label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1E] text-[#1E293B] dark:text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans text-sm"
      />

      <AnimatePresence>
        {open && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 top-full mt-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1E1E22] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03]">
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                <Clock className="h-3 w-3" /> Recent Searches
              </span>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  clearHistory(platform);
                  onHistoryChange();
                  setOpen(false);
                }}
                className="text-[10px] font-mono text-muted-foreground hover:text-red-400 transition-colors px-1"
              >
                Clear all
              </button>
            </div>

            {/* Suggestions */}
            {history.map((u) => (
              <button
                key={u}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(u);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm font-sans text-foreground hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors group"
              >
                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                <span className="truncate font-medium">{u}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Standalone LookupInput component ─────────────────────────────────────────
interface LookupInputProps {
  platform: string;
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
  onSearch: (val: string) => void;
  onHistoryChange: () => void;
  historyTick: number;
}

function LookupInput({ platform, value, disabled, onChange, onSearch, onHistoryChange, historyTick }: LookupInputProps) {
  const [open, setOpen] = useState(false);
  const history = getLookupHistory(platform);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="space-y-2 text-left relative flex-1">
      <input
        type="text"
        placeholder="Enter username to search..."
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !disabled) {
            onSearch(value);
            setOpen(false);
          }
        }}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1E] text-[#1E293B] dark:text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans text-sm"
      />

      <AnimatePresence>
        {open && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 top-full mt-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1E1E22] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03]">
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                <Clock className="h-3 w-3" /> Recent Searches
              </span>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  clearLookupHistory(platform);
                  onHistoryChange();
                  setOpen(false);
                }}
                className="text-[10px] font-mono text-muted-foreground hover:text-red-400 transition-colors px-1"
              >
                Clear all
              </button>
            </div>

            {/* Suggestions */}
            {history.map((u) => (
              <button
                key={u}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(u);
                  onSearch(u);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm font-sans text-foreground hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors group"
              >
                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                <span className="truncate font-medium">{u}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── LookupStatBox component ──────────────────────────────────────────────────
function LookupStatBox({ label, value, colorClass }: { label: string; value: string | number; colorClass: string }) {
  const str = String(value);
  const isLong = str.length > 5;
  const textSize =
    str.length <= 4  ? "text-2xl" :
    str.length <= 7  ? "text-xl" :
    str.length <= 11 ? "text-lg" :
    "text-base";

  return (
    <div className="flex flex-col items-center justify-center px-2 py-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-white/[0.06] min-h-[88px] overflow-hidden">
      {isLong ? (
        <div className="marquee-container w-full">
          <div className="marquee-track">
            <span className={`${textSize} font-black font-heading ${colorClass} leading-none`} title={str}>
              {value}
            </span>
            <span className={`${textSize} font-black font-heading ${colorClass} leading-none`} aria-hidden>
              {value}
            </span>
          </div>
        </div>
      ) : (
        <span
          className={`${textSize} font-black font-heading ${colorClass} w-full text-center leading-none whitespace-nowrap`}
          title={str}
        >
          {value}
        </span>
      )}
      <span className="text-[11px] text-[#64748B] dark:text-slate-400 uppercase tracking-wider font-mono font-semibold mt-2 text-center whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

// ── LookupPreviewCard component ──────────────────────────────────────────────
function LookupPreviewCard({
  platform,
  data,
  onClose,
}: {
  platform: "leetcode" | "codeforces" | "codechef";
  data: any;
  onClose?: () => void;
}) {
  const name = platform === "leetcode" ? "LeetCode" : platform === "codeforces" ? "Codeforces" : "CodeChef";
  const Icon = platform === "leetcode" ? Hash : platform === "codeforces" ? TrendingUp : Award;
  const colorClass = platform === "leetcode" ? "text-leetcode" : platform === "codeforces" ? "text-codeforces" : "text-codechef";
  const gradientColor = platform === "leetcode" ? "from-leetcode/20 to-leetcode/5" : platform === "codeforces" ? "from-codeforces/20 to-codeforces/5" : "from-codechef/20 to-codechef/5";

  const mainStat = {
    label: "Problems Solved",
    value: data.problemsSolved || 0
  };

  const gridStats = [];
  if (platform === "leetcode") {
    gridStats.push({ label: "Rating", value: data.contestRating || 0 });
    gridStats.push({ label: "Contests", value: data.contestCount || 0 });
    gridStats.push({ label: "Badge", value: data.badge || "None" });
  } else if (platform === "codeforces") {
    gridStats.push({ label: "Rating", value: data.currentRating || 0 });
    gridStats.push({ label: "Contests", value: data.contestCount || 0 });
    gridStats.push({ label: "Rank", value: data.rank || "—" });
  } else if (platform === "codechef") {
    gridStats.push({ label: "Rating", value: data.currentRating || 0 });
    gridStats.push({ label: "Contests", value: data.contestCount || 0 });
    gridStats.push({ label: "Stars", value: data.stars || "0★" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative rounded-3xl border border-slate-200 dark:border-transparent bg-white dark:bg-[#1A1A1E] dark:bg-gradient-to-br dark:${gradientColor} px-6 pt-6 pb-6 overflow-hidden shadow-lg w-full text-left`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] to-transparent pointer-events-none" />

      <div className="relative flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-white/5 flex items-center justify-center shadow-sm shrink-0">
              <Icon className={`h-5 w-5 ${colorClass}`} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-heading font-black text-[#1E293B] dark:text-foreground leading-tight">{name}</h3>
              <p className="text-[11px] text-muted-foreground font-mono font-medium mt-0.5 max-w-[150px] truncate" title={data.username}>
                @{data.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wide bg-primary/10 border border-primary/20 text-primary select-none">
              LIVE PREVIEW
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-white/15 flex items-center justify-center"
                title="Clear profile"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Main stat */}
        <div className="flex flex-col items-center justify-center text-center py-4 h-[100px] rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/30 border border-[#E2E8F0] dark:border-white/[0.04]">
          <p className="text-[12px] text-[#64748B] dark:text-muted-foreground uppercase tracking-[0.2em] font-mono font-bold mb-2">
            {mainStat.label}
          </p>
          <p className={`text-5xl font-black font-heading ${colorClass} tracking-tighter leading-none`}>
            {mainStat.value}
          </p>
        </div>

        {/* Grid stats */}
        <div className={`grid grid-cols-3 gap-3`}>
          {gridStats.map((stat, i) => (
            <LookupStatBox key={i} label={stat.label} value={stat.value} colorClass={colorClass} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

const Index = () => {
  const { userId } = useParams();
  const queryClient = useQueryClient();
  const { data: dash, isLoading, refetch } = useDashboard(userId);
  const achievements = useAchievements(dash);
  const recent = getRecentAchievements(achievements, 3);
  const earned = achievements.filter((a) => a.earned);
  const isOwnDashboard = !userId;
  const { toast } = useToast();
  const [showTour, setShowTour] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const [leetcodeInput, setLeetcodeInput] = useState("");
  const [codeforcesInput, setCodeforcesInput] = useState("");
  const [codechefInput, setCodechefInput] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  // Bump to force UsernameInput to re-read localStorage after clear/save
  const [historyTick, setHistoryTick] = useState(0);

  // --- Profile Lookup/Search States ---
  const [searchPlatform, setSearchPlatform] = useState<"leetcode" | "codeforces" | "codechef">("leetcode");
  const [searchUsername, setSearchUsername] = useState("");
  const [isSearchingProfile, setIsSearchingProfile] = useState(false);
  const [searchedProfileData, setSearchedProfileData] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lookupHistoryTick, setLookupHistoryTick] = useState(0);

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
      // Save successful usernames to history
      if (leetcodeInput.trim())   pushHistory("leetcode",   leetcodeInput.trim());
      if (codeforcesInput.trim()) pushHistory("codeforces", codeforcesInput.trim());
      if (codechefInput.trim())   pushHistory("codechef",   codechefInput.trim());
      setHistoryTick((t) => t + 1);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["friends-leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
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

  const handleSearchProfile = async (targetUsername?: string) => {
    const usernameToSearch = (targetUsername || searchUsername).trim();
    if (!usernameToSearch) return;

    setIsSearchingProfile(true);
    setSearchError(null);
    setSearchedProfileData(null);

    try {
      const res = await api.get(`/public/platform-stats`, {
        params: {
          platform: searchPlatform,
          username: usernameToSearch
        }
      });
      setSearchedProfileData(res.data);
      pushLookupHistory(searchPlatform, usernameToSearch);
      setLookupHistoryTick((t) => t + 1);
    } catch (err: any) {
      setSearchError(err.response?.data?.message || `Failed to fetch ${searchPlatform} profile.`);
    } finally {
      setIsSearchingProfile(false);
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

        {/* Badge Summary Section */}
        {isOwnDashboard && (
          <div className="glass rounded-3xl border border-white/10 p-8 shadow-xl mt-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Trophy className="h-7 w-7 text-primary" />
                <h2 className="text-2xl font-black font-heading text-white">Badge Summary</h2>
              </div>
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 transition-all text-sm font-bold text-white cursor-pointer"
              >
                View All
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left space-y-5">
                <div>
                  <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Badges</p>
                  <p className="text-5xl font-black font-heading text-white mt-1">
                    {earned.length}
                  </p>
                </div>
                {recent.length > 0 && (
                  <div className="space-y-1 font-mono text-left pt-3 border-t border-white/5">
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
        )}

        {isOwnDashboard && (
          <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] px-6 pt-6 pb-6 md:px-8 md:pt-6 md:pb-7 backdrop-blur-none dark:backdrop-blur-3xl shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] ring-0 dark:ring-1 dark:ring-white/5 relative overflow-visible premium-border card-hover group/connection text-left">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

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

            {/* Inputs — each manages its own dropdown state */}
            <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <UsernameInput
                key={`lc-${historyTick}`}
                platform="leetcode"
                label="LeetCode Username"
                colorClass="bg-leetcode"
                value={leetcodeInput}
                disabled={isSyncing}
                onChange={setLeetcodeInput}
                onHistoryChange={() => setHistoryTick((t) => t + 1)}
              />
              <UsernameInput
                key={`cf-${historyTick}`}
                platform="codeforces"
                label="Codeforces Username"
                colorClass="bg-codeforces"
                value={codeforcesInput}
                disabled={isSyncing}
                onChange={setCodeforcesInput}
                onHistoryChange={() => setHistoryTick((t) => t + 1)}
              />
              <UsernameInput
                key={`cc-${historyTick}`}
                platform="codechef"
                label="CodeChef Username"
                colorClass="bg-codechef"
                value={codechefInput}
                disabled={isSyncing}
                onChange={setCodechefInput}
                onHistoryChange={() => setHistoryTick((t) => t + 1)}
              />
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

        {/* ── Platform Performance (User Platform Data) ────────────────────── */}
        <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] px-6 pt-3 pb-6 md:px-8 md:pt-4 md:pb-7 backdrop-blur-none dark:backdrop-blur-3xl shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] ring-0 dark:ring-1 dark:ring-white/5 relative overflow-hidden premium-border space-y-6 mt-4 card-hover group/platform">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none group-hover/platform:opacity-70 transition-opacity" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-black text-foreground tracking-tight text-left">
                  {isOwnDashboard ? "Your Platform Performance" : `${dash?.profile?.username}'s Platform Performance`}
                </h3>
                <p className="text-sm text-muted-foreground font-mono mt-0.5 flex items-center gap-2 text-left">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {isOwnDashboard ? "Personal platform data (connect your own accounts)" : "Personal platform data of this user"}
                </p>
              </div>
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

        {/* ── Search Platform Profiles (Standalone) ─────────────────────────── */}
        <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] px-6 pt-6 pb-6 md:px-8 md:pt-6 md:pb-7 backdrop-blur-none dark:backdrop-blur-3xl shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] ring-0 dark:ring-1 dark:ring-white/5 relative overflow-visible premium-border card-hover group/search-profile text-left mt-4">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-black text-[#1E293B] dark:text-foreground tracking-tight">Search Platform Profiles</h3>
                <p className="text-sm text-[#64748B] dark:text-muted-foreground font-mono mt-0.5 flex items-center gap-2">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                  Lookup live coding statistics for any username without linking them to your dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Search controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Select Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setSearchPlatform("leetcode"); setSearchUsername(""); setSearchedProfileData(null); setSearchError(null); }}
                    className={`py-2 px-3 rounded-xl text-xs font-heading font-bold uppercase border tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      searchPlatform === "leetcode"
                        ? "bg-leetcode/15 border-leetcode text-leetcode"
                        : "bg-slate-50 dark:bg-[#1A1A1E] border-slate-200 dark:border-white/5 text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    <Hash className="h-3.5 w-3.5" />
                    LeetCode
                  </button>
                  <button
                    onClick={() => { setSearchPlatform("codeforces"); setSearchUsername(""); setSearchedProfileData(null); setSearchError(null); }}
                    className={`py-2 px-3 rounded-xl text-xs font-heading font-bold uppercase border tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      searchPlatform === "codeforces"
                        ? "bg-codeforces/15 border-codeforces text-codeforces"
                        : "bg-slate-50 dark:bg-[#1A1A1E] border-slate-200 dark:border-white/5 text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Codeforces
                  </button>
                  <button
                    onClick={() => { setSearchPlatform("codechef"); setSearchUsername(""); setSearchedProfileData(null); setSearchError(null); }}
                    className={`py-2 px-3 rounded-xl text-xs font-heading font-bold uppercase border tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      searchPlatform === "codechef"
                        ? "bg-codechef/15 border-codechef text-codechef"
                        : "bg-slate-50 dark:bg-[#1A1A1E] border-slate-200 dark:border-white/5 text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    <Award className="h-3.5 w-3.5" />
                    CodeChef
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Search Username</label>
                <div className="flex gap-2 relative">
                  <LookupInput
                    key={`lookup-${searchPlatform}-${lookupHistoryTick}`}
                    platform={searchPlatform}
                    value={searchUsername}
                    disabled={isSearchingProfile}
                    onChange={setSearchUsername}
                    onSearch={handleSearchProfile}
                    onHistoryChange={() => setLookupHistoryTick((t) => t + 1)}
                    historyTick={lookupHistoryTick}
                  />
                  <button
                    onClick={() => handleSearchProfile()}
                    disabled={isSearchingProfile || !searchUsername.trim()}
                    className="px-4 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer shadow-md flex items-center gap-1"
                  >
                    {isSearchingProfile ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Search className="h-3.5 w-3.5" />
                    )}
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Live preview display */}
            <div className="lg:col-span-7 flex flex-col justify-center items-center min-h-[180px] rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-6 relative overflow-hidden bg-slate-50/30 dark:bg-[#121214]/30">
              {isSearchingProfile && (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest animate-pulse">Fetching live data...</p>
                </div>
              )}

              {!isSearchingProfile && !searchedProfileData && !searchError && (
                <div className="text-center max-w-sm">
                  <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-sans font-bold text-foreground">No Profile Loaded</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    Select a platform, enter a username, and click Search to display their stats.
                  </p>
                </div>
              )}

              {!isSearchingProfile && searchError && (
                <div className="text-center max-w-sm text-red-500">
                  <Info className="h-10 w-10 text-red-500/20 mx-auto mb-3" />
                  <p className="text-sm font-sans font-bold">Search Failed</p>
                  <p className="text-xs font-mono mt-1 text-red-400/80">{searchError}</p>
                </div>
              )}

              {!isSearchingProfile && searchedProfileData && (
                <LookupPreviewCard
                  platform={searchPlatform}
                  data={searchedProfileData}
                  onClose={() => {
                    setSearchedProfileData(null);
                    setSearchUsername("");
                    setSearchError(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {showTour && <WebsiteTour onComplete={handleTourComplete} />}
      <BadgeDetailModal
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        achievement={selectedBadge}
      />
      <BadgeGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        achievements={achievements}
        onBadgeClick={(a) => setSelectedBadge(a)}
      />
    </DashboardLayout>
  );
};

export default Index;
