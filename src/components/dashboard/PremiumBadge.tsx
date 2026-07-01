import React from "react";
import { Achievement, formatAchievementDate } from "@/lib/achievements";
import { cn } from "@/lib/utils";
import {
  Shield,
  Crown,
  Trophy,
  Target,
  Star,
  Flame,
  Award,
  Sparkles,
  Medal,
  Bolt,
  Lock,
  X,
  CheckCircle2,
} from "lucide-react";

// Get rarity styling details (gradients, border colors, glows)
export const getRarityColors = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case "common":
      return {
        gradient: "from-slate-400 via-slate-500 to-slate-600",
        border: "from-slate-300 to-slate-700",
        glow: "shadow-slate-500/20",
        inner: "from-slate-500 to-slate-700",
        solid: "#94a3b8",
        glowColor: "rgba(148, 163, 184, 0.4)",
        gradientId: "commonGrad",
        circleGradId: "commonCircleGrad",
        stops: { start: "#94a3b8", mid: "#64748b", end: "#475569" },
        circleStops: { start: "#475569", end: "#334155" },
      };
    case "uncommon":
      return {
        gradient: "from-emerald-400 via-emerald-500 to-emerald-700",
        border: "from-emerald-300 to-emerald-800",
        glow: "shadow-emerald-500/30",
        inner: "from-emerald-500 to-emerald-700",
        solid: "#34d399",
        glowColor: "rgba(52, 211, 153, 0.4)",
        gradientId: "uncommonGrad",
        circleGradId: "uncommonCircleGrad",
        stops: { start: "#52c28b", mid: "#10b981", end: "#047857" },
        circleStops: { start: "#10b981", end: "#065f46" },
      };
    case "rare":
      return {
        gradient: "from-blue-400 via-blue-500 to-blue-700",
        border: "from-blue-300 to-blue-800",
        glow: "shadow-blue-500/40",
        inner: "from-blue-500 to-blue-700",
        solid: "#60a5fa",
        glowColor: "rgba(96, 165, 250, 0.4)",
        gradientId: "rareGrad",
        circleGradId: "rareCircleGrad",
        stops: { start: "#60a5fa", mid: "#3b82f6", end: "#1d4ed8" },
        circleStops: { start: "#3b82f6", end: "#1e3a8a" },
      };
    case "epic":
      return {
        gradient: "from-purple-400 via-purple-500 to-purple-700",
        border: "from-purple-300 to-purple-800",
        glow: "shadow-purple-500/40",
        inner: "from-purple-500 to-purple-700",
        solid: "#c084fc",
        glowColor: "rgba(192, 132, 252, 0.4)",
        gradientId: "epicGrad",
        circleGradId: "epicCircleGrad",
        stops: { start: "#c084fc", mid: "#a855f7", end: "#7e22ce" },
        circleStops: { start: "#a855f7", end: "#581c87" },
      };
    case "legendary":
      return {
        gradient: "from-yellow-300 via-amber-400 to-orange-600",
        border: "from-yellow-200 to-orange-700",
        glow: "shadow-yellow-400/50",
        inner: "from-yellow-400 via-amber-500 to-orange-600",
        solid: "#fbbf24",
        glowColor: "rgba(251, 191, 36, 0.5)",
        gradientId: "legendaryGrad",
        circleGradId: "legendaryCircleGrad",
        stops: { start: "#fbbf24", mid: "#f59e0b", end: "#d97706" },
        circleStops: { start: "#f59e0b", end: "#78350f" },
      };
    default:
      return {
        gradient: "from-slate-400 via-slate-500 to-slate-600",
        border: "from-slate-300 to-slate-700",
        glow: "shadow-slate-500/20",
        inner: "from-slate-500 to-slate-700",
        solid: "#94a3b8",
        glowColor: "rgba(148, 163, 184, 0.4)",
        gradientId: "defaultGrad",
        circleGradId: "defaultCircleGrad",
        stops: { start: "#94a3b8", mid: "#64748b", end: "#475569" },
        circleStops: { start: "#475569", end: "#334155" },
      };
  }
};

const getBadgeIcon = (iconName: string, className?: string) => {
  switch (iconName) {
    case "award":
      return <Award className={className} />;
    case "crown":
      return <Crown className={className} />;
    case "flame":
      return <Flame className={className} />;
    case "shield":
      return <Shield className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "star":
      return <Star className={className} />;
    case "target":
      return <Target className={className} />;
    case "trophy":
      return <Trophy className={className} />;
    case "medal":
      return <Medal className={className} />;
    case "bolt":
      return <Bolt className={className} />;
    default:
      return <Award className={className} />;
  }
};

interface PremiumBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  achievement,
  size = "md",
  onClick,
}) => {
  const colors = getRarityColors(achievement.rarity);
  const earned = achievement.earned;

  const sizeClasses = {
    sm: "h-20 w-20",
    md: "h-28 w-28",
    lg: "h-36 w-36",
    xl: "h-44 w-44",
  };

  // Determine vertical band label on the left (e.g. "SOLVES", "CONTEST", "LC")
  let bandLabel = "TRACK";
  if (achievement.category === "Problem Solving" || achievement.category === "Total Problems") {
    bandLabel = "SOLVES";
  } else if (achievement.category === "Contest Participation") {
    bandLabel = "CONTESTS";
  } else if (achievement.platform) {
    bandLabel = achievement.platform.toUpperCase().substring(0, 7);
  }

  // Determine central values or icon representation
  // If target progress is high (milestone), show target number, else show icon.
  const isMilestone =
    achievement.targetProgress > 1 &&
    (achievement.category === "Problem Solving" ||
      achievement.category === "Total Problems" ||
      achievement.category === "Contest Participation" ||
      achievement.id.includes("star") && !achievement.id.includes("connected"));

  // Check if CodeChef star badge
  const isCodeChefStar = achievement.id.includes("star") && !achievement.id.includes("connected");

  const displayValue = isCodeChefStar
    ? `${achievement.targetProgress}★`
    : achievement.targetProgress.toString();

  return (
    <div
      className={cn(
        "relative flex items-center justify-center cursor-pointer select-none transition-all duration-500 hover:scale-110 active:scale-95 group",
        sizeClasses[size]
      )}
      onClick={onClick}
    >
      {/* Outer Radial Glow effect for earned badges */}
      {earned && (
        <div
          className="absolute inset-0 rounded-full transition-opacity duration-500 opacity-60 group-hover:opacity-90 blur-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colors.solid} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Hexagonal SVG Badge */}
      <svg
        viewBox="0 0 100 115"
        className={cn(
          "w-full h-full filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all duration-500",
          !earned && "grayscale opacity-50 brightness-[0.6] group-hover:opacity-75 group-hover:brightness-90 group-hover:grayscale-[50%]"
        )}
      >
        <defs>
          {/* Hexagonal Outer Frame gradient */}
          <linearGradient id={colors.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={earned ? colors.stops.start : "#475569"} />
            <stop offset="50%" stopColor={earned ? colors.stops.mid : "#334155"} />
            <stop offset="100%" stopColor={earned ? colors.stops.end : "#1e293b"} />
          </linearGradient>

          {/* Inner Badge Glowing Circle gradient */}
          <linearGradient id={colors.circleGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={earned ? colors.circleStops.start : "#334155"} />
            <stop offset="100%" stopColor={earned ? colors.circleStops.end : "#0f172a"} />
          </linearGradient>

          {/* Glossy highlight layer */}
          <linearGradient id="glossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Hexagon border path */}
        <path
          d="M50 5 L92 29.2 L92 77.8 L50 102 L8 77.8 L8 29.2 Z"
          fill="#0c0c0e"
          stroke={`url(#${colors.gradientId})`}
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Highlight inner hexagon trim */}
        <path
          d="M50 11 L86 31.8 L86 73.2 L50 94 L14 73.2 L14 31.8 Z"
          fill="#131317"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Left Side Vertical Band (styled ribbon) */}
        <path
          d="M32 21.4 L14 31.8 L14 73.2 L32 83.6 Z"
          fill="#1c1c22"
          stroke="#27272f"
          strokeWidth="1"
        />

        {/* Left side text labels rotated -90 degrees */}
        <text
          x="23"
          y="52.5"
          fontSize="5.5"
          fontWeight="900"
          fontFamily="monospace"
          letterSpacing="1.2"
          textAnchor="middle"
          fill={earned ? colors.solid : "#64748b"}
          transform="rotate(-90 23 52.5)"
          className="uppercase tracking-widest opacity-80"
        >
          {bandLabel}
        </text>

        {/* Central Inner Glow Ring */}
        <circle
          cx="60"
          cy="52.5"
          r="23"
          fill={`url(#${colors.circleGradId})`}
          stroke={earned ? colors.solid : "#475569"}
          strokeWidth="1.5"
          className="transition-all duration-500"
        />

        {/* Gloss Sheen overlay on the circle */}
        <circle cx="60" cy="52.5" r="23" fill="url(#glossGrad)" />

        {/* Center overlay details: Milestone text OR platform icon */}
        {!earned ? (
          // Render central lock icon if locked
          <g transform="translate(50, 42.5)">
            <foreignObject x="0" y="0" width="20" height="20">
              <Lock className="w-5 h-5 text-slate-500/70" />
            </foreignObject>
          </g>
        ) : isMilestone ? (
          // Render numeric text if milestone
          <text
            x="60"
            y="59.5"
            fontSize={displayValue.length > 3 ? "14" : "17"}
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
            textAnchor="middle"
            fill="#ffffff"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans"
          >
            {displayValue}
          </text>
        ) : (
          // Render Lucide Icon inside foreignObject
          <g transform="translate(50, 42.5)">
            <foreignObject x="0" y="0" width="20" height="20">
              {getBadgeIcon(achievement.icon, "w-5 h-5 text-white drop-shadow")}
            </foreignObject>
          </g>
        )}
      </svg>
    </div>
  );
};

interface BadgeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement | null;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  isOpen,
  onClose,
  achievement,
}) => {
  if (!isOpen || !achievement) return null;
  const colors = getRarityColors(achievement.rarity);

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="rounded-[2.5rem] border border-white/10 bg-[#0c0c0e] max-w-md w-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colorful Gradient Header */}
        <div
          className={cn(
            "p-8 bg-gradient-to-br flex justify-center relative overflow-hidden",
            achievement.earned ? colors.gradient : "from-slate-800 to-slate-950"
          )}
        >
          {/* Glass Overlay */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] pointer-events-none" />
          
          <PremiumBadge achievement={achievement} size="xl" />
        </div>

        {/* Content details */}
        <div className="p-8 space-y-6 text-left">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black font-heading tracking-tight text-white">
              {achievement.title}
            </h2>
            <div className="flex justify-center gap-2">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider uppercase",
                  achievement.earned
                    ? `bg-white/10 text-white border border-white/20`
                    : "bg-white/5 text-muted-foreground border border-white/5"
                )}
              >
                {achievement.rarity}
              </span>
              {achievement.platform && (
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider uppercase bg-white/5 text-muted-foreground border border-white/5">
                  {achievement.platform}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4 font-mono text-sm border-t border-white/5 pt-4">
            <div className="flex justify-between py-1 border-b border-white/[0.02]">
              <span className="text-muted-foreground uppercase text-xs font-bold">Category</span>
              <span className="text-white font-bold">{achievement.category}</span>
            </div>

            <div className="space-y-1.5 py-1 border-b border-white/[0.02]">
              <span className="text-muted-foreground uppercase text-xs font-bold block">Description</span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {achievement.description}
              </p>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-muted-foreground uppercase text-xs font-bold">Unlocked</span>
              <span className={cn("font-bold font-mono", achievement.earned ? "text-emerald-400" : "text-slate-500")}>
                {formatAchievementDate(achievement.earnedDate)}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold text-white border border-white/10 hover:border-white/20 active:scale-[0.98] font-heading text-sm"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

interface BadgeGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  onBadgeClick: (achievement: Achievement) => void;
}

export const BadgeGalleryModal: React.FC<BadgeGalleryModalProps> = ({
  isOpen,
  onClose,
  achievements,
  onBadgeClick,
}) => {
  if (!isOpen) return null;

  const earned = achievements.filter((a) => a.earned);
  const locked = achievements.filter((a) => !a.earned);

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="rounded-[2.5rem] border border-white/10 bg-[#0a0a0c] max-w-5xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-3xl font-black font-heading text-white tracking-tight">
              My Badges Collection
            </h2>
            <p className="text-xs font-mono text-muted-foreground mt-1 uppercase tracking-widest">
              Earned: {earned.length} / Total: {achievements.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all active:scale-95"
          >
            <X className="h-6 w-6 text-muted-foreground hover:text-white" />
          </button>
        </div>

        <div className="space-y-12">
          {/* Earned Section */}
          {earned.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold font-heading text-emerald-400 flex items-center gap-2 tracking-tight">
                <CheckCircle2 className="h-5 w-5" />
                Earned Badges ({earned.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {earned.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => onBadgeClick(a)}
                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-3xl border border-white/5 bg-[#121217] hover:bg-[#181822] hover:border-white/10 transition-all duration-300 cursor-pointer shadow-md group/card"
                  >
                    <PremiumBadge achievement={a} size="md" />
                    <span className="text-xs font-bold text-slate-200 mt-1 line-clamp-1 group-hover/card:text-white text-center">
                      {a.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Section */}
          {locked.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-white/5">
              <h3 className="text-lg font-bold font-heading text-slate-500 flex items-center gap-2 tracking-tight">
                <Lock className="h-5 w-5 text-slate-500" />
                Locked Badges ({locked.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {locked.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => onBadgeClick(a)}
                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-3xl border border-white/5 bg-[#0f0f12] opacity-75 hover:opacity-100 hover:bg-[#121217] hover:border-white/10 transition-all duration-300 cursor-pointer group/card"
                  >
                    <PremiumBadge achievement={a} size="md" />
                    <span className="text-xs font-bold text-slate-500 line-clamp-1 group-hover/card:text-slate-300 text-center">
                      {a.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
