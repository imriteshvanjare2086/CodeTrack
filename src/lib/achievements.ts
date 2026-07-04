import { useMemo } from "react";
import type { DashboardData } from "@/hooks/useDashboard";

export type AchievementCategory =
  | "Platform Rankings"
  | "Problem Solving"
  | "Total Problems"
  | "Contest Participation";

export type AchievementRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export type AchievementIcon =
  | "award"
  | "badge"
  | "bolt"
  | "crown"
  | "flame"
  | "medal"
  | "shield"
  | "sparkles"
  | "star"
  | "target"
  | "trophy";

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  platform?: "LeetCode" | "Codeforces" | "CodeChef" | "Overall";
  rarity: AchievementRarity;
  icon: AchievementIcon;
  requirement: string;
  targetProgress: number;
  getProgress: (data: DashboardData) => number;
};

export type Achievement = AchievementDefinition & {
  currentProgress: number;
  earned: boolean;
  earnedDate?: string;
  percent: number;
  remaining: number;
};

const problemMilestones = [10, 25, 50, 100, 250, 500, 750, 1000, 1500, 2000];
const totalProblemMilestones = [25, 50, 100, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000];
const contestMilestones = [
  { title: "First Contest", target: 1 },
  { title: "5 Contests", target: 5 },
  { title: "10 Contests", target: 10 },
  { title: "20 Contests", target: 20 },
  { title: "35 Contests", target: 35 },
  { title: "50 Contests", target: 50 },
  { title: "75 Contests", target: 75 },
  { title: "100 Contests", target: 100 },
  { title: "150 Contests", target: 150 },
  { title: "250 Contests", target: 250 },
];

const cfRanks = [
  { title: "Newbie", rating: 1 },
  { title: "Pupil", rating: 1200 },
  { title: "Specialist", rating: 1400 },
  { title: "Expert", rating: 1600 },
  { title: "Candidate Master", rating: 1900 },
  { title: "Master", rating: 2100 },
  { title: "International Master", rating: 2300 },
  { title: "Grandmaster", rating: 2400 },
  { title: "International Grandmaster", rating: 2600 },
  { title: "Legendary Grandmaster", rating: 3000 },
];

const lcRanks = [
  { title: "Beginner", rating: 1 },
  { title: "Knight", rating: 1850 },
  { title: "Guardian", rating: 2190 },
];

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function rarityForMilestone(value: number): AchievementRarity {
  if (value >= 2000) return "Legendary";
  if (value >= 1000) return "Epic";
  if (value >= 250) return "Rare";
  if (value >= 50) return "Uncommon";
  return "Common";
}

function rarityForRank(index: number, total: number): AchievementRarity {
  const ratio = (index + 1) / total;
  if (ratio > 0.8) return "Legendary";
  if (ratio > 0.6) return "Epic";
  if (ratio > 0.4) return "Rare";
  if (ratio > 0.2) return "Uncommon";
  return "Common";
}

function parseStars(stars?: string) {
  const match = String(stars || "0").match(/[1-7]/);
  return match ? Number(match[0]) : 0;
}

function getCodeChefTargetRating(stars: number) {
  if (stars <= 1) return 1;
  if (stars === 2) return 1400;
  if (stars === 3) return 1600;
  if (stars === 4) return 1800;
  if (stars === 5) return 2000;
  if (stars === 6) return 2200;
  return 2500;
}

export const achievementDefinitions: AchievementDefinition[] = [
  {
    id: "codechef-connected",
    title: "Rising Coder",
    description: "Connected a CodeChef account and started the rating journey.",
    category: "Platform Rankings",
    platform: "CodeChef",
    rarity: "Common",
    icon: "flame",
    requirement: "Connect a CodeChef account.",
    targetProgress: 1,
    getProgress: (data) => (data.codechefStats.username ? 1 : 0),
  },
  ...Array.from({ length: 7 }, (_, i) => {
    const stars = i + 1;
    return {
      id: `codechef-${stars}-star`,
      title: `${stars} Star`,
      description: `Reached ${stars} star on CodeChef.`,
      category: "Platform Rankings" as const,
      platform: "CodeChef" as const,
      rarity: rarityForRank(i, 7),
      icon: stars >= 5 ? "crown" as const : "star" as const,
      requirement: `Reach CodeChef ${stars} star.`,
      targetProgress: stars,
      getProgress: (data: DashboardData) => parseStars(data.codechefStats.stars),
    };
  }),
  ...cfRanks.map((rank, index) => ({
    id: `codeforces-${slug(rank.title)}`,
    title: rank.title,
    description: `Reached the ${rank.title} rank on Codeforces.`,
    category: "Platform Rankings" as const,
    platform: "Codeforces" as const,
    rarity: rarityForRank(index, cfRanks.length),
    icon: index >= 7 ? "crown" as const : "shield" as const,
    requirement: rank.rating === 1 ? "Connect a rated Codeforces profile." : `Reach ${rank.rating}+ Codeforces rating.`,
    targetProgress: rank.rating,
    getProgress: (data: DashboardData) => data.codeforcesStats.currentRating || data.codeforcesStats.maxRating || 0,
  })),
  ...lcRanks.map((rank, index) => ({
    id: `leetcode-${slug(rank.title)}`,
    title: rank.title,
    description: `Reached the ${rank.title} badge threshold on LeetCode.`,
    category: "Platform Rankings" as const,
    platform: "LeetCode" as const,
    rarity: rarityForRank(index, lcRanks.length),
    icon: rank.title === "Guardian" ? "crown" as const : "badge" as const,
    requirement: rank.rating === 1 ? "Connect a LeetCode profile." : `Reach ${rank.rating}+ LeetCode contest rating.`,
    targetProgress: rank.rating,
    getProgress: (data: DashboardData) => data.leetcodeStats.contestRating || 0,
  })),
  ...(["LeetCode", "Codeforces", "CodeChef"] as const).flatMap((platform) =>
    problemMilestones.map((target) => ({
      id: `${slug(platform)}-${target}-problems`,
      title: `${platform} ${target} Problems`,
      description: `Solved ${target} problems on ${platform}.`,
      category: "Problem Solving" as const,
      platform,
      rarity: rarityForMilestone(target),
      icon: target >= 1000 ? "trophy" as const : "bolt" as const,
      requirement: `Solve ${target} ${platform} problems.`,
      targetProgress: target,
      getProgress: (data: DashboardData) => {
        if (platform === "LeetCode") return data.leetcodeStats.problemsSolved || 0;
        if (platform === "Codeforces") return data.codeforcesStats.problemsSolved || 0;
        return data.codechefStats.problemsSolved || 0;
      },
    }))
  ),
  ...totalProblemMilestones.map((target) => ({
    id: `total-${target}-problems`,
    title: `${target} Total Problems`,
    description: `Solved ${target} problems across all connected platforms.`,
    category: "Total Problems" as const,
    platform: "Overall" as const,
    rarity: rarityForMilestone(target),
    icon: target >= 2000 ? "crown" as const : "target" as const,
    requirement: `Solve ${target} total problems.`,
    targetProgress: target,
    getProgress: (data: DashboardData) => data.heroStats.totalProblems || 0,
  })),
  ...contestMilestones.map((milestone) => ({
    id: `contest-${milestone.target}`,
    title: milestone.title,
    description: `Participated in ${milestone.target} contest${milestone.target === 1 ? "" : "s"} across connected platforms.`,
    category: "Contest Participation" as const,
    platform: "Overall" as const,
    rarity: rarityForMilestone(milestone.target * 10),
    icon: milestone.target >= 100 ? "crown" as const : "medal" as const,
    requirement: `Participate in ${milestone.target} contest${milestone.target === 1 ? "" : "s"}.`,
    targetProgress: milestone.target,
    getProgress: (data: DashboardData) => data.heroStats.totalContests || 0,
  })),
];

function getStorageKey(data?: DashboardData) {
  return `codecraft_achievements_${data?.profile?._id || data?.profile?.email || "local"}`;
}

function readEarnedDates(key: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function writeEarnedDates(key: string, earnedDates: Record<string, string>) {
  localStorage.setItem(key, JSON.stringify(earnedDates));
}

export function resolveAchievements(data?: DashboardData): Achievement[] {
  if (!data) return [];

  const key = getStorageKey(data);
  const earnedDates = readEarnedDates(key);
  const today = new Date().toISOString();
  let changed = false;

  const achievements = achievementDefinitions.map((definition) => {
    const currentProgress = Math.max(0, definition.getProgress(data));
    const earned = currentProgress >= definition.targetProgress;

    if (earned && !earnedDates[definition.id]) {
      earnedDates[definition.id] = today;
      changed = true;
    }

    return {
      ...definition,
      currentProgress,
      earned,
      earnedDate: earned ? earnedDates[definition.id] : undefined,
      percent: Math.min(100, Math.round((currentProgress / definition.targetProgress) * 100)),
      remaining: Math.max(0, definition.targetProgress - currentProgress),
    };
  });

  if (changed) writeEarnedDates(key, earnedDates);
  return achievements;
}

export function useAchievements(data?: DashboardData) {
  return useMemo(() => resolveAchievements(data), [data]);
}

export function getAchievementStats(achievements: Achievement[]) {
  const earned = achievements.filter((achievement) => achievement.earned).length;
  const total = achievements.length;
  return {
    total,
    earned,
    locked: total - earned,
    completion: total > 0 ? Math.round((earned / total) * 100) : 0,
  };
}

export function getNextAchievement(achievements: Achievement[]) {
  return achievements
    .filter((achievement) => !achievement.earned)
    .sort((a, b) => b.percent - a.percent || a.remaining - b.remaining)[0];
}

export function getRecentAchievements(achievements: Achievement[], limit = 3) {
  const rarityOrder: Record<AchievementRarity, number> = {
    Legendary: 5,
    Epic: 4,
    Rare: 3,
    Uncommon: 2,
    Common: 1,
  };
  return achievements
    .filter((achievement) => achievement.earned && achievement.earnedDate)
    .sort((a, b) => {
      const rA = rarityOrder[a.rarity] || 1;
      const rB = rarityOrder[b.rarity] || 1;
      if (rB !== rA) return rB - rA;
      if (b.targetProgress !== a.targetProgress) return b.targetProgress - a.targetProgress;
      return new Date(b.earnedDate || 0).getTime() - new Date(a.earnedDate || 0).getTime();
    })
    .slice(0, limit);
}

export function formatAchievementDate(date?: string) {
  if (!date) return "Locked";
  return new Date(date).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
}
