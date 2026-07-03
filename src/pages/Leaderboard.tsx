import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/services/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Target, Medal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function profilePath(userId: string) {
  return `/profile/${userId}`;
}

function initials(name: string) {
  return name.substring(0, 2).toUpperCase();
}

const rankStyles = [
  {
    chip: "border-yellow-400/60 bg-gradient-to-br from-yellow-400/30 to-yellow-600/20 text-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.35)]",
    row: "border-yellow-400/40 bg-gradient-to-r from-yellow-400/[0.18] via-yellow-400/[0.07] to-transparent shadow-[0_0_40px_rgba(250,204,21,0.16)] ring-1 ring-yellow-400/10",
    avatar: "border-yellow-400/50 shadow-[0_0_18px_rgba(250,204,21,0.30)]",
    score: "text-yellow-300",
    tag: "Grandmaster",
    tagClass: "border-yellow-400/50 bg-gradient-to-r from-yellow-400/20 to-yellow-600/10 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.35)]",
    medal: "🥇",
  },
  {
    chip: "border-slate-300/50 bg-gradient-to-br from-slate-300/25 to-slate-400/15 text-slate-200 shadow-[0_0_12px_rgba(203,213,225,0.25)]",
    row: "border-slate-300/35 bg-gradient-to-r from-slate-200/[0.15] via-slate-300/[0.06] to-transparent shadow-[0_0_30px_rgba(203,213,225,0.13)] ring-1 ring-slate-300/10",
    avatar: "border-slate-300/45 shadow-[0_0_14px_rgba(203,213,225,0.22)]",
    score: "text-slate-100",
    tag: "Expert",
    tagClass: "border-slate-300/40 bg-gradient-to-r from-slate-300/20 to-slate-400/10 text-slate-200 shadow-[0_0_16px_rgba(203,213,225,0.28)]",
    medal: "🥈",
  },
  {
    chip: "border-amber-500/50 bg-gradient-to-br from-amber-500/25 to-amber-700/15 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.28)]",
    row: "border-amber-500/35 bg-gradient-to-r from-amber-500/[0.15] via-amber-500/[0.06] to-transparent shadow-[0_0_30px_rgba(245,158,11,0.14)] ring-1 ring-amber-500/10",
    avatar: "border-amber-500/45 shadow-[0_0_14px_rgba(245,158,11,0.25)]",
    score: "text-amber-400",
    tag: "Specialist",
    tagClass: "border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-amber-700/10 text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.28)]",
    medal: "🥉",
  },
  {
    chip: "border-primary/20 bg-primary/5 text-muted-foreground",
    row: "border-border dark:border-white/8 bg-card dark:bg-white/[0.02]",
    avatar: "border-border dark:border-white/10",
    score: "text-foreground",
    tag: "Challenger",
    tagClass: "border-primary/20 bg-primary/5 text-primary/70",
    medal: null,
  },
];

export default function Leaderboard() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
    refetchInterval: 30000,
  });

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-10 px-4 pb-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Global Leaderboard"
            description="Ranked by consistency, speed & platform performance."
          />
          <div className="flex w-fit items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.75)]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-green-400">Live</span>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={cn(
                "h-20 w-full animate-pulse rounded-2xl border bg-muted/30",
                i === 0 ? "border-yellow-400/20 bg-yellow-400/5" :
                i === 1 ? "border-slate-300/20 bg-slate-300/5" :
                i === 2 ? "border-amber-500/20 bg-amber-500/5" :
                "border-border"
              )} />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {users && users.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10 bg-card dark:bg-card/35 shadow-2xl shadow-black/20 backdrop-blur-2xl"
              >
                {/* Header with gradient banner */}
                <div className="relative overflow-hidden border-b border-slate-200 dark:border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-yellow-400/5 to-transparent pointer-events-none" />
                  <div className="relative flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-yellow-400/10 border border-primary/20">
                          <Trophy className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading text-base font-black text-foreground">Global Standings</h3>
                          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                            Every coder in one clean ranking strip
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
                        <Medal className="h-3 w-3 text-primary/60" />
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary/80">{users.length} ranked</span>
                      </div>
                      <div className="flex w-fit items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.75)] animate-pulse" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-green-400">Live</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden grid-cols-[64px_minmax(0,1fr)_96px_128px] items-center gap-5 border-b border-slate-100 dark:border-white/5 bg-muted/20 px-5 py-2.5 font-mono text-[9px] font-black uppercase tracking-[0.20em] text-muted-foreground sm:grid">
                  <span className="text-center">Rank</span>
                  <span>Coder</span>
                  <span className="text-right">Score</span>
                  <span className="text-center">Title</span>
                </div>

                <div className="space-y-2 p-3 sm:p-4">
                  {users.map((user, i) => {
                    const isMe = (user as any).isMe;
                    const style = rankStyles[i] ?? rankStyles[3];

                    return (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i, ease: [0.23, 1, 0.32, 1] }}
                        className={cn(
                          "group grid min-h-[76px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-300 hover:-translate-y-0.5 sm:grid-cols-[64px_minmax(0,1fr)_96px_128px] sm:gap-5 sm:px-5",
                          i < 3
                            ? style?.row
                            : "border-border/60 dark:border-white/8 bg-card/60 dark:bg-white/[0.02] hover:border-primary/25 hover:bg-muted/50 dark:hover:bg-white/[0.045]",
                          isMe && "ring-2 ring-primary/25 ring-offset-1 ring-offset-background"
                        )}
                      >
                        {/* Rank chip */}
                        <div className="flex items-center justify-center">
                          {i < 3 && style?.medal ? (
                            <div className={cn(
                              "flex h-10 min-w-10 flex-col items-center justify-center rounded-xl border font-mono text-xl leading-none",
                              style?.chip
                            )}>
                              <span>{style.medal}</span>
                            </div>
                          ) : (
                            <span
                              className={cn(
                                "flex h-10 min-w-10 items-center justify-center rounded-xl border font-mono text-sm font-black leading-none tabular-nums",
                                i < 3 ? style?.chip : "border-border/50 dark:border-white/10 bg-muted/50 dark:bg-white/5 text-muted-foreground"
                              )}
                            >
                              {i + 1}
                            </span>
                          )}
                        </div>

                        {/* User info */}
                        <Link to={profilePath(user._id)} className="flex min-w-0 items-center gap-3">
                          <Avatar className={cn("h-11 w-11 shrink-0 rounded-xl border-2 transition-all duration-300 group-hover:scale-105 sm:h-12 sm:w-12", i < 3 ? style?.avatar : "border-border dark:border-white/10 group-hover:border-primary/40")}>
                            <AvatarImage src={(user as any).profileImage} className="object-cover" />
                            <AvatarFallback className="rounded-xl bg-primary/10 text-xs font-black uppercase text-primary">
                              {initials(user.username)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className={cn(
                                "min-w-0 truncate font-heading text-sm font-black leading-tight transition-colors group-hover:text-primary sm:text-base",
                                i < 3 ? style?.score : "text-foreground"
                              )}>
                                {user.username}
                              </span>
                              {isMe && (
                                <Badge className="h-4 shrink-0 border-primary/30 bg-primary/15 px-1.5 py-0 text-[8px] font-black uppercase tracking-widest text-primary">
                                  YOU
                                </Badge>
                              )}
                            </div>
                            {i < 3 && (
                              <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wider">
                                #{i + 1} worldwide
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* Score */}
                        <div className="flex min-w-[82px] flex-col items-end gap-1 sm:min-w-0 sm:flex-row sm:items-center sm:justify-end sm:gap-1.5">
                          <div className="flex items-baseline justify-end gap-1">
                            <Zap className={cn("h-3 w-3", i < 3 ? style?.score : "text-muted-foreground/50")} />
                            <span className={cn("font-heading text-lg font-black leading-none tabular-nums sm:text-xl", i < 3 ? style?.score : "text-foreground")}>
                              {(user as any).overallScore ?? 0}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[9px] font-black uppercase leading-none tracking-widest sm:hidden",
                              i < 3 ? style?.tagClass : "border-primary/20 bg-primary/5 text-primary/70"
                            )}
                          >
                            {style?.tag}
                          </span>
                        </div>

                        {/* Tag (desktop) */}
                        <div className="hidden justify-center sm:flex">
                          <span
                            className={cn(
                              "inline-flex min-w-[108px] justify-center whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase leading-none tracking-widest",
                              i < 3 ? style?.tagClass : "border-primary/20 bg-primary/5 text-primary/70"
                            )}
                          >
                            {style?.tag}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {(!users || users.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/5 bg-muted/10">
                  <Target className="h-10 w-10 text-muted-foreground/20" />
                </div>
                <h3 className="mb-2 font-heading text-xl font-black text-foreground">The Arena is Empty</h3>
                <p className="mx-auto max-w-xs font-mono text-xs uppercase tracking-widest text-muted-foreground opacity-60">
                  Be the first to claim a spot on the global standings.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div className="pointer-events-none fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="pointer-events-none fixed -right-40 -top-40 h-96 w-96 rounded-full bg-yellow-400/5 blur-[120px]" />
      </div>
    </DashboardLayout>
  );
}
