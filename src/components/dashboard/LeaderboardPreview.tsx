import { motion } from "framer-motion";
import { Trophy, Medal, Crown } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";

const rankIcons: Record<number, React.ReactNode> = {
  1: <Crown className="h-3.5 w-3.5 text-leetcode" />,
  2: <Medal className="h-3.5 w-3.5 text-muted-foreground" />,
  3: <Medal className="h-3.5 w-3.5 text-codechef" />,
};

export function LeaderboardPreview() {
  const { data } = useDashboard();
  const leaderboard = data?.leaderboard || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 card-hover"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-1.5 rounded-lg bg-leetcode/10">
          <Trophy className="h-4 w-4 text-leetcode" />
        </div>
        <h3 className="text-sm font-heading font-semibold text-foreground">Leaderboard</h3>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">Top performers</span>
      </div>
      <div className="space-y-1.5">
        {leaderboard.map((user, i) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85 + i * 0.05 }}
            className={`group flex items-center gap-3 rounded-xl p-3 text-sm font-mono card-hover ${
              user.name === "You"
                ? "bg-primary/10 border border-primary/20 shadow-sm shadow-primary/5"
                : ""
            }`}
          >
            <div className="w-7 flex items-center justify-center">
              {rankIcons[user.rank] || (
                <span className="text-xs font-bold text-muted-foreground">{user.rank}</span>
              )}
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
              user.name === "You"
                ? "bg-primary/20 text-primary border border-primary/30"
                : user.rank <= 3
                  ? "bg-leetcode/15 text-leetcode border border-leetcode/20"
                  : "bg-secondary text-secondary-foreground border border-border/50"
            }`}>
              {user.avatar}
            </div>
            <span className={`flex-1 ${user.name === "You" ? "text-primary font-semibold" : "text-foreground"}`}>
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground font-mono tabular-nums">
              {user.score.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
