import { Info } from "lucide-react";
import { useState, useEffect } from "react";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const LEVEL_COLORS = [
  "bg-slate-200 dark:bg-[#1b1f23]",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/70",
  "bg-primary"
];

export function ContributionGraph({ stats: externalStats }: { stats?: any }) {
  const stats = externalStats || { totalSubmissions: 0, activeDays: 0 };

  const getDayColor = (level: number) => {
    return LEVEL_COLORS[level] || LEVEL_COLORS[0];
  };

  return (
    <div className="rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161618] px-3 pt-2 pb-4 sm:px-6 sm:pt-3 sm:pb-6 md:px-8 md:pt-4 md:pb-7 backdrop-blur-none dark:backdrop-blur-3xl shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] ring-0 dark:ring-1 dark:ring-white/5 premium-border relative overflow-hidden group/contributions mt-4 sm:mt-6 card-hover">
      
      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-6 px-1 sm:px-2">
        <div className="flex flex-col gap-1 sm:gap-1.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary shadow-[0_0_8px_hsla(var(--primary),0.5)] animate-pulse" />
            <h4 className="text-[8px] sm:text-xs font-black text-muted-foreground uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono leading-none">
              Activity Matrix
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-2xl font-black tracking-tight text-foreground">
              {stats?.totalSubmissions !== undefined ? stats.totalSubmissions.toLocaleString() : "0"} Submissions
            </h3>
            <span className="hidden sm:inline text-xs text-[#64748B] dark:text-muted-foreground font-mono">in the past year</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[8px] sm:text-[10px] text-foreground/80 font-mono uppercase tracking-widest font-black">Active</span>
          <span className="text-xs sm:text-sm font-black text-primary tabular-nums tracking-tight italic">
            {stats?.activeDays || 0} Days
          </span>
        </div>
      </div>

      {/* Grid Canvas - 12 Monthly Boxes with centered labels */}
      <div className="relative z-10 overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-fit px-2">
          <div
            style={{
              display: "flex",
              gap: "12px", // Reduced from 28px
            }}
          >
            {MONTH_LABELS.map((month) => (
              <div key={month} className="flex flex-col gap-3">
                {/* Centered Month Label */}
                <span className="text-[10px] text-foreground/70 font-black font-mono uppercase tracking-[0.2em] text-center w-full">
                  {month}
                </span>
                
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 10px)", // Reduced from 15px
                    gridTemplateRows: "repeat(7, 10px)",    // Reduced from 15px
                    gap: "3px" // Reduced from 5px
                  }}
                  className="rounded-lg"
                >
                  {Array.from({ length: 4 * 7 }).map((_, i) => {
                    // Generate dummy level weighted towards 0 and 1, with occasional higher levels
                    const rand = Math.random();
                    let level = 0;
                    if (rand > 0.6) level = 1;
                    if (rand > 0.8) level = 2;
                    if (rand > 0.9) level = 3;
                    if (rand > 0.95) level = 4;
                    
                    return (
                      <div
                        key={i}
                        className={`${getDayColor(level)} w-[10px] h-[10px] rounded-[2px] border border-foreground/5 transition-all duration-300 cursor-pointer hover:border-primary/50 hover:shadow-[0_0_10px_hsla(var(--primary),0.2)] hover:scale-110 active:scale-95`}
                        title={level > 0 ? `${Math.floor(Math.random() * 8) + 1} submissions on this day` : "No activity recorded"}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend & Info */}
      <div className="relative z-10 flex items-center justify-between mt-6 px-2">
        <div className="flex items-center gap-2 group/info cursor-help">
          <Info className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover/info:text-primary" />
          <span className="text-[9px] font-bold text-foreground/80 uppercase tracking-widest font-mono">Real-time sync</span>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/40 px-4 py-2 rounded-full border border-slate-200 dark:border-white/5 transition-colors hover:border-slate-300 dark:hover:border-white/10 shadow-sm">
          <span className="text-[9px] text-foreground/80 font-bold font-mono uppercase tracking-widest">Less</span>
          <div className="flex gap-[4px]">
            {LEVEL_COLORS.map((colorClass, index) => (
              <div 
                key={index} 
                className={`w-[11px] h-[11px] rounded-[3px] ${colorClass} border border-foreground/5 transition-transform hover:scale-110`} 
              />
            ))}
          </div>
          <span className="text-[9px] text-foreground/80 font-bold font-mono uppercase tracking-widest">More</span>
        </div>
      </div>
      

    </div>
  );
}



