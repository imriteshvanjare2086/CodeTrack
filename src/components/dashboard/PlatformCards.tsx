import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, TrendingUp, Award, Hash, LogOut, Loader2, AlertTriangle } from "lucide-react";
import { api } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

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
  badge?: string;
}

function StatBox({ label, value, colorClass }: { label: string; value: string | number; colorClass: string }) {
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

// Confirm disconnect modal
function DisconnectModal({
  name,
  colorClass,
  onConfirm,
  onCancel,
  loading,
}: {
  name: string;
  colorClass: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 rounded-3xl bg-[#111113]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6"
    >
      <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-heading font-bold text-foreground">Disconnect {name}?</p>
        <p className="text-[11px] text-muted-foreground font-mono mt-1">
          Your stats will be cleared. You can reconnect anytime.
        </p>
      </div>
      <div className="flex gap-2 w-full">
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-2 rounded-xl text-[12px] font-mono font-semibold bg-muted/60 hover:bg-muted text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 px-3 py-2 rounded-xl text-[12px] font-mono font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
          {loading ? "Disconnecting…" : "Disconnect"}
        </button>
      </div>
    </motion.div>
  );
}

function PlatformCard({
  name,
  platformKey,
  icon: Icon,
  colorClass,
  gradientColor,
  username,
  isConnected,
  mainStat,
  gridStats,
  delay,
  readOnly = false,
}: {
  name: string;
  platformKey: string;
  icon: any;
  colorClass: string;
  gradientColor: string;
  username: string;
  isConnected: boolean;
  mainStat: { label: string; value: string | number };
  gridStats: Array<{ label: string; value: string | number }>;
  delay: number;
  readOnly?: boolean;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const queryClient = useQueryClient();

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await api.post("/user/disconnect-platform", { platform: platformKey });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.refetchQueries({ queryKey: ["dashboard"] });
    } catch (e) {
      console.error("Disconnect failed:", e);
    } finally {
      setDisconnecting(false);
      setShowConfirm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`group relative rounded-3xl border border-slate-200 dark:border-transparent bg-white dark:bg-[#1A1A1E] dark:bg-gradient-to-br dark:${gradientColor} px-6 pt-6 pb-6 overflow-hidden card-hover`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] to-transparent pointer-events-none" />

      {/* Disconnect confirm overlay */}
      <AnimatePresence>
        {showConfirm && (
          <DisconnectModal
            name={name}
            colorClass={colorClass}
            onConfirm={handleDisconnect}
            onCancel={() => setShowConfirm(false)}
            loading={disconnecting}
          />
        )}
      </AnimatePresence>

      <div className="relative flex flex-col gap-5">
        {/* Platform header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-white/5 flex items-center justify-center shadow-sm shrink-0">
              <Icon className={`h-5 w-5 ${colorClass}`} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-heading font-black text-[#1E293B] dark:text-foreground leading-tight">{name}</h3>
              <p className="text-[11px] text-muted-foreground font-mono font-medium mt-0.5 max-w-[130px] truncate" title={isConnected ? username : undefined}>
                {isConnected ? `@${username}` : "Not Connected"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Status pill */}
            <div className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wide ${
              isConnected
                ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-muted-foreground"
            }`}>
              {isConnected ? "LIVE" : "OFFLINE"}
            </div>

            {/* Disconnect button — only shown when connected and editable */}
            {isConnected && !readOnly && (
              <button
                onClick={() => setShowConfirm(true)}
                title={`Disconnect ${name}`}
                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
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
        <div className={`grid ${gridStats.length === 3 ? "grid-cols-3" : "grid-cols-2"} gap-3`}>
          {gridStats.map((stat, i) => (
            <StatBox key={i} label={stat.label} value={stat.value} colorClass={colorClass} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function PlatformCards({
  leetcodeStats,
  codeforcesStats,
  codechefStats,
  readOnly = false,
}: {
  leetcodeStats?: PlatformStats;
  codeforcesStats?: PlatformStats;
  codechefStats?: PlatformStats;
  readOnly?: boolean;
}) {
  const isLcConnected = !!leetcodeStats?.username;
  const isCfConnected = !!codeforcesStats?.username;
  const isCcConnected = !!codechefStats?.username;

  const platforms = [
    {
      name: "LeetCode",
      platformKey: "leetcode",
      icon: Hash,
      colorClass: "text-leetcode",
      gradientColor: "from-leetcode/20 to-leetcode/5",
      username: leetcodeStats?.username || "",
      isConnected: isLcConnected,
      mainStat: {
        label: "Problems Solved",
        value: isLcConnected ? (leetcodeStats?.problemsSolved || 0) : 0,
      },
      gridStats: [
        { label: "Rating", value: isLcConnected ? Math.round(leetcodeStats?.contestRating || 0) : 0 },
        { label: "Contests", value: isLcConnected ? (leetcodeStats?.contestCount || 0) : 0 },
        { label: "Badge", value: isLcConnected ? (leetcodeStats?.badge && leetcodeStats?.badge !== "None" ? leetcodeStats.badge : "None") : "—" },
      ],
      delay: 0.4,
    },
    {
      name: "Codeforces",
      platformKey: "codeforces",
      icon: TrendingUp,
      colorClass: "text-codeforces",
      gradientColor: "from-codeforces/20 to-codeforces/5",
      username: codeforcesStats?.username || "",
      isConnected: isCfConnected,
      mainStat: {
        label: "Problems Solved",
        value: isCfConnected ? (codeforcesStats?.problemsSolved || 0) : 0,
      },
      gridStats: [
        { label: "Rating", value: isCfConnected ? (codeforcesStats?.currentRating || 0) : 0 },
        { label: "Contests", value: isCfConnected ? (codeforcesStats?.contestCount || 0) : 0 },
        { label: "Rank", value: isCfConnected ? (codeforcesStats?.rank || "—") : "—" },
      ],
      delay: 0.5,
    },
    {
      name: "CodeChef",
      platformKey: "codechef",
      icon: Award,
      colorClass: "text-codechef",
      gradientColor: "from-codechef/20 to-codechef/5",
      username: codechefStats?.username || "",
      isConnected: isCcConnected,
      mainStat: {
        label: "Problems Solved",
        value: isCcConnected ? (codechefStats?.problemsSolved || 0) : 0,
      },
      gridStats: [
        { label: "Rating", value: isCcConnected ? (codechefStats?.currentRating || 0) : 0 },
        { label: "Contests", value: isCcConnected ? (codechefStats?.contestCount || 0) : 0 },
        { label: "Stars", value: isCcConnected ? (codechefStats?.stars || "0★") : "—" },
      ],
      delay: 0.6,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {platforms.map((p) => (
        <PlatformCard key={p.name} {...p} readOnly={readOnly} />
      ))}
    </div>
  );
}
