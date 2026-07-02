import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/services/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Target } from "lucide-react";
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
    chip: "border-yellow-400/35 bg-yellow-400/10 text-yellow-300",
    row: "border-yellow-400/30 bg-gradient-to-r from-yellow-400/[0.14] via-yellow-400/[0.06] to-white/[0.025] shadow-[0_0_30px_rgba(250,204,21,0.12)]",
    avatar: "border-yellow-400/35",
    score: "text-yellow-300",
    tag: "Grandmaster",
    tagClass: "border-yellow-400/35 bg-yellow-400/10 text-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.28)]",
  },
  {
    chip: "border-slate-300/30 bg-slate-300/10 text-slate-200",
    row: "border-slate-300/25 bg-gradient-to-r from-slate-200/[0.12] via-slate-300/[0.045] to-white/[0.025] shadow-[0_0_24px_rgba(203,213,225,0.1)]",
    avatar: "border-slate-300/30",
    score: "text-slate-100",
    tag: "Expert",
    tagClass: "border-slate-300/30 bg-slate-300/10 text-slate-100 shadow-[0_0_16px_rgba(203,213,225,0.22)]",
  },
  {
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    row: "border-amber-500/25 bg-gradient-to-r from-amber-500/[0.12] via-amber-500/[0.045] to-white/[0.025] shadow-[0_0_24px_rgba(245,158,11,0.11)]",
    avatar: "border-amber-500/30",
    score: "text-amber-400",
    tag: "Specialist",
    tagClass: "border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.22)]",
  },
  {
    chip: "border-green-400/25 bg-green-400/10 text-green-400",
    row: "border-green-400/20 bg-gradient-to-r from-green-400/[0.075] via-green-400/[0.028] to-white/[0.02] shadow-[0_0_18px_rgba(74,222,128,0.07)]",
    avatar: "border-green-400/25",
    score: "text-green-400",
    tag: "Challenger",
    tagClass: "border-green-400/25 bg-green-400/10 text-green-400 shadow-[0_0_14px_rgba(74,222,128,0.18)]",
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
              <div key={i} className="h-20 w-full animate-pulse rounded-2xl border border-white/5 bg-white/5" />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {users && users.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-card/35 shadow-2xl shadow-black/20 backdrop-blur-2xl"
              >
                <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.025] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <h3 className="font-heading text-base font-black text-foreground">Global Standings</h3>
                    </div>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Every coder in one clean ranking strip
                    </p>
                  </div>
                  <div className="font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {users.length} ranked
                  </div>
                </div>

                <div className="hidden grid-cols-[64px_minmax(0,1fr)_96px_128px] items-center gap-5 border-b border-white/5 px-5 py-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground sm:grid">
                  <span className="text-center">Rank</span>
                  <span>Coder</span>
                  <span className="text-right">Score</span>
                  <span className="text-center">Tag</span>
                </div>

                <div className="space-y-2 p-3 sm:p-4">
                  {users.map((user, i) => {
                    const isMe = (user as any).isMe;
                    const style = rankStyles[i] ?? rankStyles[3];

                    return (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 * i }}
                        className={cn(
                          "group grid min-h-[76px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/[0.055] sm:grid-cols-[64px_minmax(0,1fr)_96px_128px] sm:gap-5 sm:px-5",
                          style?.row
                        )}
                      >
                        <div className="flex items-center justify-center">
                          <span
                            className={cn(
                              "flex h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-mono text-sm font-black leading-none text-muted-foreground tabular-nums",
                              style?.chip
                            )}
                          >
                            {i + 1}
                          </span>
                        </div>

                        <Link to={profilePath(user._id)} className="flex min-w-0 items-center gap-3">
                          <Avatar className={cn("h-11 w-11 shrink-0 rounded-xl border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/30 sm:h-12 sm:w-12", style?.avatar)}>
                            <AvatarImage src={(user as any).profileImage} className="object-cover" />
                            <AvatarFallback className="rounded-xl bg-primary/10 text-xs font-black uppercase text-primary">
                              {initials(user.username)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="min-w-0 truncate font-heading text-sm font-black leading-tight text-foreground transition-colors group-hover:text-primary sm:text-base">
                                {user.username}
                              </span>
                              {isMe && (
                                <Badge className="h-4 shrink-0 border-primary/20 bg-primary/10 px-1.5 py-0 text-[8px] font-black uppercase tracking-widest text-primary">
                                  YOU
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Link>

                        <div className="flex min-w-[82px] flex-col items-end gap-1 sm:min-w-0 sm:flex-row sm:items-center sm:justify-end sm:gap-1.5">
                          <div className="flex items-baseline justify-end gap-1.5">
                            <Zap className={cn("h-3.5 w-3.5 text-primary/45", style?.score)} />
                            <span className={cn("font-heading text-lg font-black leading-none tabular-nums text-foreground sm:text-xl", style?.score)}>
                              {(user as any).overallScore ?? 0}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[9px] font-black uppercase leading-none tracking-widest sm:hidden",
                              style?.tagClass
                            )}
                          >
                            {style?.tag}
                          </span>
                        </div>

                        <div className="hidden justify-center sm:flex">
                          <span
                            className={cn(
                              "inline-flex min-w-[108px] justify-center whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[10px] font-black uppercase leading-none tracking-widest",
                              style?.tagClass
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
