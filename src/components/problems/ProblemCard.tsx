import { motion } from "framer-motion";
import { ExternalLink, Flame, Trophy, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Problem {
  id: number;
  title: string;
  platform: "leetcode" | "codeforces" | "codechef";
  difficulty: "Easy" | "Medium" | "Hard";
  url: string;
}

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const handleSolve = () => {
    window.open(problem.url, "_blank");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Hard":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "leetcode":
        return <Flame className="h-3 w-3 mr-1" />;
      case "codeforces":
        return <Trophy className="h-3 w-3 mr-1" />;
      case "codechef":
        return <Code2 className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getPlatformClass = (platform: string) => {
    switch (platform) {
      case "leetcode":
        return "text-[#FFA116] border-[#FFA116]/20 bg-[#FFA116]/8 shadow-[0_0_15px_rgba(255,161,22,0.1)]";
      case "codeforces":
        return "text-[#188AD2] border-[#188AD2]/20 bg-[#188AD2]/8 shadow-[0_0_15px_rgba(24,138,210,0.1)]";
      case "codechef":
        return "text-[#5B4638] border-[#5B4638]/20 bg-[#5B4638]/8 shadow-[0_0_15px_rgba(91,70,56,0.1)]";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      layout
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="glass-strong group relative overflow-hidden rounded-3xl p-6 tilt-card premium-border card-hover"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
      
      <div className="relative flex flex-col gap-6 h-full">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <h3 className="font-heading text-lg font-black leading-tight text-foreground transition-colors group-hover:text-primary tracking-tight">
              {problem.title}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("text-[10px] h-5 rounded-full border-white/5 bg-white/5 text-muted-foreground transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20", getDifficultyColor(problem.difficulty))}>
                {problem.difficulty}
              </Badge>
              <div className="h-1 w-1 rounded-full bg-border" />
              <div className="text-[10px] font-mono text-muted-foreground font-bold tracking-widest uppercase">
                ID: {problem.id}
              </div>
            </div>
          </div>
          <Badge className={cn("px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 group-hover:scale-105", getPlatformClass(problem.platform))}>
            {getPlatformIcon(problem.platform)}
            {problem.platform}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-card bg-muted/20 text-[8px] flex items-center justify-center font-bold text-muted-foreground">
                U{i}
              </div>
            ))}
            <div className="h-6 w-6 rounded-full border-2 border-card bg-primary/10 text-[8px] flex items-center justify-center font-bold text-primary">
              +12
            </div>
          </div>
          
          <Button
            size="sm"
            onClick={handleSolve}
            variant="premium"
            className="h-9 gap-2 px-5 group/btn overflow-hidden relative shadow-md shadow-primary/10 dark:shadow-lg dark:shadow-primary/20 transition-all duration-500 hover:shadow-primary/30 active:scale-95 border border-primary/20 dark:border-transparent"
          >
            <span className="relative z-10 flex items-center gap-2 font-black text-xs uppercase tracking-wider">
              Solve Problem
              <ExternalLink className="h-3.5 w-3.5 transition-transform duration-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full transition-transform duration-500 group-hover/btn:translate-y-0" />
          </Button>
        </div>
      </div>
      
      {/* Decorative accent rail */}
      <div className={cn(
        "absolute bottom-0 left-0 h-[3px] w-0 bg-primary transition-all duration-700 ease-in-out group-hover:w-full opacity-50",
        problem.platform === 'leetcode' && 'bg-[#FFA116]',
        problem.platform === 'codeforces' && 'bg-[#188AD2]',
        problem.platform === 'codechef' && 'bg-[#5B4638]'
      )} />
      
      {/* Glossy shine effect */}
      <div className="absolute -inset-[100%] group-hover:left-[100%] transition-all duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] pointer-events-none" />
    </motion.div>
  );
}
