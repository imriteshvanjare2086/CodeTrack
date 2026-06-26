import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboard } from "@/hooks/useDashboard";
import { TrendingUp } from "lucide-react";

type Platform = "codeforces" | "leetcode" | "codechef";

const platformConfig: Record<Platform, { label: string; color: string }> = {
  codeforces: { label: "Codeforces", color: "#4D9EFF" },
  leetcode:   { label: "LeetCode",   color: "#FFA116" },
  codechef:   { label: "CodeChef",   color: "#44D17F" },
};

// Glowing dot only on the last data point
const CustomDot = (props: any) => {
  const { cx, cy, index, data, color } = props;
  if (index !== data.length - 1) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill={color} opacity={0.12} />
      <circle cx={cx} cy={cy} r={6}  fill={color} opacity={0.30} />
      <circle cx={cx} cy={cy} r={3}  fill={color} />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label, color }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#18181b] px-4 py-2.5 shadow-2xl">
      <p className="text-[10px] font-mono text-slate-400 mb-1 truncate max-w-[180px]">{label}</p>
      <p className="text-lg font-black font-heading" style={{ color }}>{payload[0]?.value}</p>
    </div>
  );
};

export function RatingGraph({ userId }: { userId?: string }) {
  const [platform, setPlatform] = useState<Platform>("codeforces");
  const { data: dash } = useDashboard(userId);
  const data = ((dash?.ratingHistory as any)?.[platform] || []) as any[];
  const config = platformConfig[platform];

  const latest = data[data.length - 1] || { rating: 0 };
  const prev   = data[data.length - 2] || latest;
  const delta  = (latest?.rating || 0) - (prev?.rating || 0);
  const isUp   = delta >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-5 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-secondary">
            <TrendingUp className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">
              Contest Rating
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-heading" style={{ color: config.color }}>
                {latest.rating || 0}
              </span>
              {data.length > 1 && (
                <span className={`text-sm font-bold font-mono ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                  {isUp ? "↗ +" : "↘ "}{delta}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Platform tabs */}
        <div className="flex gap-1 rounded-xl bg-muted/80 p-1 border border-border/50">
          {(Object.keys(platformConfig) as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all duration-200 ${
                platform === p
                  ? "bg-card shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={platform === p ? { color: platformConfig[p].color } : {}}
            >
              {platformConfig[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[175px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground font-mono opacity-60">
              No contest history — sync to load data
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="contest"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => {
                  if (!v) return "";
                  // Show only short form
                  const parts = v.split(" ");
                  return parts.length > 2 ? parts.slice(0, 2).join(" ") + "…" : v.slice(0, 14);
                }}
                interval="preserveStartEnd"
              />
              <Tooltip
                content={<CustomTooltip color={config.color} />}
                cursor={{ stroke: config.color, strokeWidth: 1, strokeDasharray: "5 3", opacity: 0.5 }}
              />
              <Line
                type="linear"
                dataKey="rating"
                stroke={config.color}
                strokeWidth={2.5}
                dot={(props: any) => <CustomDot {...props} data={data} color={config.color} />}
                activeDot={{ r: 5, fill: config.color, stroke: "hsl(var(--background))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
