import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/services/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Target, Medal, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function profilePath(userId: string) {
  return `/profile/${userId}`;
}

function initials(name: string) {
  return name.substring(0, 2).toUpperCase();
}

export default function Leaderboard() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
    refetchInterval: 30000,
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />;
      case 2: return <Medal className="h-6 w-6 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]" />;
      case 3: return <Medal className="h-6 w-6 text-amber-600 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]" />;
      default: return <span className="text-muted-foreground font-mono font-black text-sm">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number, isMe?: boolean) => {
    if (isMe) return "bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary";
    switch (rank) {
      case 1: return "bg-yellow-400/5 hover:bg-yellow-400/10 border-yellow-400/20";
      case 2: return "bg-slate-300/5 hover:bg-slate-300/10 border-slate-300/20";
      case 3: return "bg-amber-600/5 hover:bg-amber-600/10 border-amber-600/20";
      default: return "hover:bg-muted/30";
    }
  };

  const getRankLabel = (index: number) => {
    if (index === 0) return "Grandmaster";
    if (index === 1) return "Master";
    if (index === 2) return "Expert";
    if (index < 10) return "Challenger";
    return "Rookie";
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-10 pb-20">
        <PageHeader
          title="Global Leaderboard"
          description="Competitive programming rankings based on consistency, speed, and platform performance."
        />

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 w-full animate-shimmer rounded-3xl bg-muted/10 border border-foreground/5" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-[2.5rem] border border-foreground/10 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-2xl premium-border"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.02] to-transparent pointer-events-none" />

            <div className="w-full overflow-x-auto pb-4">
              <Table className="min-w-[680px] lg:min-w-full">
                <TableHeader className="bg-muted/10">
                  <TableRow className="hover:bg-transparent border-foreground/5 uppercase tracking-[0.2em] font-mono text-[10px]">
                    <TableHead className="w-[80px] sm:w-[100px] text-center font-black">Rank</TableHead>
                    <TableHead className="font-black">Coder</TableHead>
                    <TableHead className="text-right font-black">Score</TableHead>
                    <TableHead className="text-right font-black">Rank Label</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {users?.map((user, index) => (
                      <motion.tr
                        layout
                        key={user._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "group border-foreground/5 transition-all duration-500 hover:-translate-y-0.5",
                          getRankStyle(index + 1, (user as any).isMe)
                        )}
                      >
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                            {getRankIcon(index + 1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={profilePath(user._id)}
                            className="flex items-center gap-4 group/user py-2"
                          >
                            <div className="relative">
                              <Avatar className="h-12 w-12 rounded-2xl border-2 border-foreground/5 shadow-xl transition-all duration-500 group-hover/user:border-primary/50 group-hover/user:scale-105 group-hover/user:shadow-primary/20">
                                <AvatarImage src={(user as any).profileImage} className="object-cover" />
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary uppercase font-black text-xs">
                                  {initials(user.username)}
                                </AvatarFallback>
                              </Avatar>
                              {index < 3 && (
                                <div className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-background rounded-full border border-foreground/10 flex items-center justify-center shadow-lg">
                                  <Sparkles className={cn("h-2.5 w-2.5", index === 0 ? "text-yellow-400" : index === 1 ? "text-slate-300" : "text-amber-600")} />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-black text-foreground group-hover/user:text-primary transition-colors tracking-tight text-base flex items-center gap-2">
                                {user.username}
                                {(user as any).isMe && (
                                  <Badge className="text-[8px] h-4 py-0 px-1.5 bg-primary/10 text-primary border-primary/20 font-black tracking-widest uppercase">YOU</Badge>
                                )}
                              </span>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2 pr-2">
                            <Zap className="h-4 w-4 text-primary/50" />
                            <span className="font-heading font-black text-xl text-foreground tabular-nums tracking-tighter transition-all group-hover:scale-110 group-hover:text-primary">
                              {(user as any).overallScore ?? 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end pr-2">
                            <span className={cn(
                              "text-[11px] sm:text-[12px] uppercase tracking-[0.2em] font-mono font-black py-1 px-3 rounded-full w-fit border transition-all duration-300 relative overflow-hidden",
                              index < 3 
                                ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_hsla(var(--primary),0.5)]" 
                                : "bg-muted/30 text-muted-foreground border-foreground/5"
                            )}>
                              {index < 3 && (
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-[shineline_2s_infinite] pointer-events-none" />
                              )}
                              {getRankLabel(index)}
                            </span>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {(!users || users.length === 0) && (
              <div className="py-24 text-center group/no-results">
                <div className="h-16 w-16 bg-muted/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-foreground/5 transition-transform group-hover/no-results:scale-110 duration-700">
                  <Target className="h-8 w-8 text-muted-foreground/20" />
                </div>
                <h3 className="font-heading font-black text-lg text-foreground mb-2 tracking-tight">The Arena is Empty</h3>
                <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest max-w-xs mx-auto opacity-60">Be the first to claim a spot on the global standings.</p>
              </div>
            )}

            <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -top-20 -right-20 h-64 w-64 bg-codeforces/10 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
