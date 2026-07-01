import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/services/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Sparkles, Zap, Crown, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function profilePath(userId: string) {
  return `/profile/${userId}`;
}

function initials(name: string) {
  return name.substring(0, 2).toUpperCase();
}

const TIER_CONFIG = [
  {
    label: "Grandmaster",
    color: "text-yellow-400",
    border: "border-yellow-400/40",
    bg: "bg-yellow-400/5",
    glow: "shadow-[0_0_40px_rgba(250,204,21,0.25)]",
    icon: <Crown className="h-5 w-5 text-yellow-400" />,
    badge: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  },
  {
    label: "Master",
    color: "text-slate-300",
    border: "border-slate-300/40",
    bg: "bg-slate-300/5",
    glow: "shadow-[0_0_30px_rgba(203,213,225,0.15)]",
    icon: <Medal className="h-5 w-5 text-slate-300" />,
    badge: "bg-slate-300/10 text-slate-300 border-slate-300/30",
  },
  {
    label: "Expert",
    color: "text-amber-600",
    border: "border-amber-600/40",
    bg: "bg-amber-600/5",
    glow: "shadow-[0_0_30px_rgba(180,83,9,0.15)]",
    icon: <Medal className="h-5 w-5 text-amber-600" />,
    badge: "bg-amber-600/10 text-amber-600 border-amber-600/30",
  },
];

export default function Leaderboard() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
    refetchInterval: 30000,
  });

  const getRankLabel = (index: number) => {
    if (index === 0) return "Grandmaster";
    if (index === 1) return "Master";
    if (index === 2) return "Expert";
    if (index < 10) return "Challenger";
    return "Rookie";
  };

  const podium = users?.slice(0, 3) ?? [];
  const rest = users?.slice(3) ?? [];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-10 pb-20 px-4">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Global Leaderboard"
            description="Ranked by consistency, speed & platform performance."
          />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-green-400 uppercase tracking-widest">Live</span>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-3xl bg-white/5 border border-white/5" />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {/* ── Top-3 Podium ── */}
            {podium.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-3 gap-4 items-end"
              >
                {/* 2nd place */}
                {podium[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className={cn(
                      "relative flex flex-col items-center gap-3 rounded-3xl border p-6 pt-8 text-center transition-all duration-500 hover:scale-[1.02]",
                      TIER_CONFIG[1].border,
                      TIER_CONFIG[1].bg,
                      TIER_CONFIG[1].glow
                    )}
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background border border-slate-300/30 shadow-lg">
                      <span className="font-black text-slate-300 text-sm">2</span>
                    </div>
                    <Avatar className="h-16 w-16 rounded-2xl border-2 border-slate-300/30 shadow-xl">
                      <AvatarImage src={(podium[1] as any).profileImage} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-slate-300/20 to-slate-300/5 text-slate-300 uppercase font-black">
                        {initials(podium[1].username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link to={profilePath(podium[1]._id)} className="font-black text-foreground hover:text-slate-300 transition-colors text-sm">
                        {podium[1].username}
                      </Link>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Zap className="h-3 w-3 text-slate-300" />
                        <span className="font-heading font-black text-slate-300 text-xl tabular-nums">
                          {(podium[1] as any).overallScore ?? 0}
                        </span>
                      </div>
                    </div>
                    <span className={cn("text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full border", TIER_CONFIG[1].badge)}>
                      Master
                    </span>
                  </motion.div>
                )}

                {/* 1st place — tallest */}
                {podium[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className={cn(
                      "relative flex flex-col items-center gap-3 rounded-3xl border p-6 pt-10 text-center transition-all duration-500 hover:scale-[1.02]",
                      TIER_CONFIG[0].border,
                      TIER_CONFIG[0].bg,
                      TIER_CONFIG[0].glow
                    )}
                  >
                    {/* Crown */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <Crown className="h-10 w-10 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
                    </div>
                    <Avatar className="h-20 w-20 rounded-2xl border-2 border-yellow-400/50 shadow-xl shadow-yellow-400/20">
                      <AvatarImage src={(podium[0] as any).profileImage} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 text-yellow-400 uppercase font-black text-lg">
                        {initials(podium[0].username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link to={profilePath(podium[0]._id)} className="font-black text-foreground hover:text-yellow-400 transition-colors">
                        {podium[0].username}
                      </Link>
                      {(podium[0] as any).isMe && (
                        <Badge className="ml-2 text-[8px] h-4 py-0 px-1.5 bg-primary/10 text-primary border-primary/20 font-black tracking-widest uppercase">YOU</Badge>
                      )}
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="font-heading font-black text-yellow-400 text-3xl tabular-nums">
                          {(podium[0] as any).overallScore ?? 0}
                        </span>
                      </div>
                    </div>
                    <span className={cn("text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full border", TIER_CONFIG[0].badge)}>
                      Grandmaster
                    </span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent" />
                    </div>
                  </motion.div>
                )}

                {/* 3rd place */}
                {podium[2] && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className={cn(
                      "relative flex flex-col items-center gap-3 rounded-3xl border p-6 pt-8 text-center transition-all duration-500 hover:scale-[1.02]",
                      TIER_CONFIG[2].border,
                      TIER_CONFIG[2].bg,
                      TIER_CONFIG[2].glow
                    )}
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background border border-amber-600/30 shadow-lg">
                      <span className="font-black text-amber-600 text-sm">3</span>
                    </div>
                    <Avatar className="h-16 w-16 rounded-2xl border-2 border-amber-600/30 shadow-xl">
                      <AvatarImage src={(podium[2] as any).profileImage} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-amber-600/20 to-amber-600/5 text-amber-600 uppercase font-black">
                        {initials(podium[2].username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link to={profilePath(podium[2]._id)} className="font-black text-foreground hover:text-amber-600 transition-colors text-sm">
                        {podium[2].username}
                      </Link>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Zap className="h-3 w-3 text-amber-600" />
                        <span className="font-heading font-black text-amber-600 text-xl tabular-nums">
                          {(podium[2] as any).overallScore ?? 0}
                        </span>
                      </div>
                    </div>
                    <span className={cn("text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full border", TIER_CONFIG[2].badge)}>
                      Expert
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── Rest of leaderboard ── */}
            {rest.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-3xl border border-white/10 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl"
              >
                <div className="grid grid-cols-[56px_1fr_auto_auto] gap-4 px-6 py-3 border-b border-white/5 bg-white/[0.02] uppercase tracking-[0.18em] font-mono text-[10px] text-muted-foreground font-black">
                  <span className="text-center">Rank</span>
                  <span>Coder</span>
                  <span className="text-right pr-2">Score</span>
                  <span className="text-right pr-2">Tier</span>
                </div>

                <div className="divide-y divide-white/5">
                  {rest.map((user, i) => {
                    const rank = i + 4;
                    const isMe = (user as any).isMe;
                    return (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * i }}
                        className={cn(
                          "group grid grid-cols-[56px_1fr_auto_auto] gap-4 items-center px-6 py-4 transition-all duration-300 hover:bg-white/5",
                          isMe && "bg-primary/5 border-l-2 border-l-primary"
                        )}
                      >
                        <div className="flex justify-center">
                          <span className="font-mono font-black text-sm text-muted-foreground tabular-nums">{rank}</span>
                        </div>

                        <Link to={profilePath(user._id)} className="flex items-center gap-3 group/user">
                          <Avatar className="h-10 w-10 rounded-xl border border-white/10 shadow transition-all duration-300 group-hover/user:border-primary/30 group-hover/user:scale-105">
                            <AvatarImage src={(user as any).profileImage} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary uppercase font-black text-xs">
                              {initials(user.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-foreground group-hover/user:text-primary transition-colors tracking-tight">
                              {user.username}
                            </span>
                            {isMe && (
                              <Badge className="text-[8px] h-4 py-0 px-1.5 bg-primary/10 text-primary border-primary/20 font-black tracking-widest uppercase">YOU</Badge>
                            )}
                          </div>
                        </Link>

                        <div className="flex items-center justify-end gap-1.5 pr-2">
                          <Zap className="h-3.5 w-3.5 text-primary/40" />
                          <span className="font-heading font-black text-lg text-foreground tabular-nums group-hover:text-primary transition-colors">
                            {(user as any).overallScore ?? 0}
                          </span>
                        </div>

                        <div className="flex justify-end pr-2">
                          <span className="text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full bg-muted/30 text-muted-foreground border border-white/5">
                            {getRankLabel(rank - 1)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Empty state */}
            {(!users || users.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center"
              >
                <div className="h-20 w-20 bg-muted/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                  <Target className="h-10 w-10 text-muted-foreground/20" />
                </div>
                <h3 className="font-heading font-black text-xl text-foreground mb-2">The Arena is Empty</h3>
                <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest max-w-xs mx-auto opacity-60">
                  Be the first to claim a spot on the global standings.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Ambient glows */}
        <div className="fixed -bottom-40 -left-40 h-96 w-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed -top-40 -right-40 h-96 w-96 bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </DashboardLayout>
  );
}
