import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { useDashboard } from "@/hooks/useDashboard";
import { TrendingUp } from "lucide-react";

type Platform = "codeforces" | "leetcode";

const platformConfig: Record<Platform, { label: string; color: string; cssColor: string; gradient: string }> = {
  codeforces: { label: "Codeforces", color: "hsl(215, 80%, 55%)", cssColor: "text-codeforces", gradient: "from-codeforces/20" },
  leetcode: { label: "LeetCode", color: "hsl(36, 100%, 50%)", cssColor: "text-leetcode", gradient: "from-leetcode/20" },
};

export function RatingGraph({ userId }: { userId?: string }) {
  const [platform, setPlatform] = useState<Platform>("codeforces");
  const { data: dash } = useDashboard(userId);
  const ratingHistory = dash?.ratingHistory;
  const data = (ratingHistory?.[platform] || []) as any[];
  const config = platformConfig[platform];
  const latest = data[data.length - 1] || { rating: 0 };
  const prev = data[data.length - 2] || latest;
  const delta = (latest?.rating || 0) - (prev?.rating || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 h-full card-hover"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-secondary">
            <TrendingUp className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground">Rating History</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs font-mono font-bold ${config.cssColor}`}>{latest.rating}</span>
              <span className={`text-[10px] font-mono ${delta >= 0 ? "text-primary" : "text-destructive"}`}>
                {delta >= 0 ? "+" : ""}{delta}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 rounded-xl bg-muted/80 p-1 border border-border/50">
          {(Object.keys(platformConfig) as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                platform === p
                  ? `bg-card shadow-sm ${platformConfig[p].cssColor} font-semibold`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {platformConfig[p].label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${platform}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
            <XAxis
              dataKey="contest"
              tick={{ fontSize: 9, fill: "currentColor" }}
              className="text-[#64748B] dark:text-slate-500"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "currentColor" }}
              className="text-[#64748B] dark:text-slate-500"
              axisLine={false}
              tickLine={false}
              domain={["dataMin - 50", "dataMax + 50"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "12px",
                fontFamily: "JetBrains Mono",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Area
              type="monotone"
              dataKey="rating"
              stroke={config.color}
              strokeWidth={2.5}
              fill={`url(#gradient-${platform})`}
              dot={{ fill: config.color, r: 4, strokeWidth: 2, stroke: "hsl(228, 14%, 10%)" }}
              activeDot={{ r: 6, strokeWidth: 3, stroke: "hsl(228, 14%, 10%)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
