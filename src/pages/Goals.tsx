import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Sparkles, Plus, Flag, Loader2, ListPlus, Check } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Goal } from "@/components/goals/types";
import { GoalCard } from "@/components/goals/GoalCard";
import { AddGoalModal } from "@/components/goals/AddGoalModal";
import { type GoalRecommendation } from "@/components/goals/RecommendationCard";
import { useDashboard, type DashboardData } from "@/hooks/useDashboard";

type Tab = "goals" | "recommendations";

function priorityFromGap(current: number, target: number): GoalRecommendation["priority"] {
  const ratio = target > 0 ? current / target : 1;
  if (ratio < 0.5) return "High";
  if (ratio < 0.8) return "Medium";
  return "Low";
}

function getNextProblemMilestone(solved: number): number {
  if (solved < 50) return 50;
  if (solved < 100) return 100;
  if (solved < 250) return 250;
  if (solved < 500) return 500;
  if (solved < 1000) return 1000;
  if (solved < 1500) return 1500;
  if (solved < 2000) return 2000;
  return Math.ceil((solved + 1) / 500) * 500;
}

function getNextContestMilestone(contests: number): number {
  if (contests < 5) return 5;
  if (contests < 10) return 10;
  if (contests < 20) return 20;
  if (contests < 50) return 50;
  if (contests < 100) return 100;
  return Math.ceil((contests + 1) / 50) * 50;
}

function getNextCodeforcesRatingTarget(rating: number): { target: number; rank: string; actions: string[] } {
  if (rating < 1200) {
    return { target: 1200, rank: "Pupil", actions: ["Practice 800-1100 rated greedy and implementation problems. Focus on speed and accuracy."] };
  }
  if (rating < 1400) {
    return { target: 1400, rank: "Specialist", actions: ["Practice 1100-1300 rated constructive algorithms, math, and complete searches."] };
  }
  if (rating < 1600) {
    return { target: 1600, rank: "Expert", actions: ["Practice 1300-1500 rated dynamic programming, binary search, and basic graph/tree algorithms."] };
  }
  if (rating < 1900) {
    return { target: 1900, rank: "Candidate Master", actions: ["Practice 1500-1800 rated segment trees, combinatorics, DFS/BFS tree queries."] };
  }
  if (rating < 2100) {
    return { target: 2100, rank: "Master", actions: ["Upsolve Div1 A/B problems. Focus on advanced dynamic programming and complex game theory/probability."] };
  }
  if (rating < 2300) {
    return { target: 2300, rank: "International Master", actions: ["Focus on Div1 C/D upsolves, centroid decomposition, and advanced math."] };
  }
  if (rating < 2400) {
    return { target: 2400, rank: "Grandmaster", actions: ["Train speed on Div1 C/D. Master flow networks, heavy-light decomposition, and FFT."] };
  }
  if (rating < 2600) {
    return { target: 2600, rank: "International Grandmaster", actions: ["Solve harder training camp sets, complex geometry, and top-tier math logic."] };
  }
  return { target: 3000, rank: "Legendary Grandmaster", actions: ["Focus on maximum speed on Div1 E/F problems. Compete at the highest competitive programming tier."] };
}

function getNextLeetCodeRatingTarget(rating: number): { target: number; rank: string; actions: string[] } {
  if (rating < 1500) {
    return { target: 1500, rank: "Average Coder", actions: ["Solve LeetCode Easy/Medium questions. Master standard patterns like Two Pointers and sliding window."] };
  }
  if (rating < 1600) {
    return { target: 1600, rank: "Intermediate Coder", actions: ["Focus on Medium questions involving binary search, BFS/DFS, and basic back-tracking."] };
  }
  if (rating < 1850) {
    return { target: 1850, rank: "Knight", actions: ["Aim for the top 5% of users. Focus on standard dynamic programming, heaps, and graph traversals."] };
  }
  if (rating < 2190) {
    return { target: 2190, rank: "Guardian", actions: ["Aim for the top 1% of users. Solve contest Q3/Q4, focus on advanced DP, tries, and segment trees."] };
  }
  if (rating < 2500) {
    return { target: 2500, rank: "Top Guardian", actions: ["Practice hard contest questions. Focus on advanced graphs, shortest paths, and complex DP states."] };
  }
  return { target: Math.ceil((rating + 100) / 100) * 100, rank: "Elite Coder", actions: ["Upsolve hard problem sets. Focus on high-level speed and custom data structure implementations."] };
}

function getNextCodeChefRatingTarget(rating: number): { target: number; rank: string; actions: string[] } {
  if (rating < 1400) {
    return { target: 1400, rank: "2 Star", actions: ["Solve basic arrays, sorting, implementation, and prefix sum problems."] };
  }
  if (rating < 1600) {
    return { target: 1600, rank: "3 Star", actions: ["Practice intermediate greedy algorithms, binary search, and basic recursion."] };
  }
  if (rating < 1800) {
    return { target: 1800, rank: "4 Star", actions: ["Focus on dynamic programming, BFS/DFS, and standard tree algorithms."] };
  }
  if (rating < 2000) {
    return { target: 2000, rank: "5 Star", actions: ["Upsolve contest problems, focus on number theory, advanced graph algorithms, and combinatorics."] };
  }
  if (rating < 2200) {
    return { target: 2200, rank: "6 Star", actions: ["Focus on Div1/Div2 hard problems. Master segment trees, LCA, and string matching."] };
  }
  return { target: 2500, rank: "7 Star", actions: ["Upsolve 7-star tier challenges. Focus on heavy implementations and advanced system/math queries."] };
}

function makeRecommendation(data?: DashboardData): GoalRecommendation[] {
  if (!data) return [];

  const recs: Array<GoalRecommendation & { gap: number }> = [];
  const connectedPlatforms = [
    data.leetcodeStats.username,
    data.codeforcesStats.username,
    data.codechefStats.username,
  ].filter(Boolean).length;

  if (connectedPlatforms === 0) {
    return [
      {
        id: "connect-platforms",
        platform: "Overall",
        metric: "Rank",
        title: "Connect your coding profiles",
        description: "Add LeetCode, Codeforces, and CodeChef usernames so recommendations can use your real ratings, ranks, contests, and solved counts.",
        current: "0 connected",
        target: "3 connected",
        priority: "High",
        actions: ["Connect at least one platform from your profile page."],
        goalTitle: "Connect coding profiles",
        goalCategory: "Competitive Programming",
        targetNumber: "3",
      },
    ];
  }

  if (data.codeforcesStats.username) {
    const rating = data.codeforcesStats.currentRating || data.codeforcesStats.maxRating || 0;
    const solved = data.codeforcesStats.problemsSolved || 0;
    const contests = data.codeforcesStats.contestCount || 0;
    const rank = data.codeforcesStats.rank || "Unrated";

    const nextSolved = getNextProblemMilestone(solved);
    recs.push({
      id: "codeforces-problems",
      platform: "Codeforces",
      metric: "Problems",
      title: `Solve ${nextSolved} problems on Codeforces`,
      description: `You have solved ${solved} problems. Scale your problem solving depth to build speed and visual pattern recognition.`,
      current: `${solved}`,
      target: `${nextSolved}`,
      priority: priorityFromGap(solved, nextSolved),
      actions: ["Upsolve contest problems immediately and tag unsolved ones by category."],
      goalTitle: `Solve ${nextSolved} Codeforces problems`,
      goalCategory: "Codeforces",
      targetNumber: String(nextSolved - solved),
      gap: (nextSolved - solved) / nextSolved,
      weakArea: "Low problem-solving volume on Codeforces limits logic familiarity.",
    });

    const nextRatingObj = getNextCodeforcesRatingTarget(rating);
    let ratingWeakArea = "Struggling with advanced algorithms (queries, segment trees) and system-level math.";
    if (nextRatingObj.target <= 1200) {
      ratingWeakArea = "Struggling with basic implementation speed, greedy constructs, or brute force logic.";
    } else if (nextRatingObj.target <= 1400) {
      ratingWeakArea = "Struggling with constructive algorithms and simple math logic.";
    } else if (nextRatingObj.target <= 1600) {
      ratingWeakArea = "Struggling with dynamic programming, binary search, and basic trees.";
    }

    recs.push({
      id: "codeforces-rating",
      platform: "Codeforces",
      metric: "Rating",
      title: `Push Codeforces rating to ${nextRatingObj.target} (${nextRatingObj.rank})`,
      description: `Your rating is ${rating} (${rank}). Aiming for ${nextRatingObj.target} will establish your next rating rank.`,
      current: `${rating}`,
      target: `${nextRatingObj.target} (${nextRatingObj.rank})`,
      priority: priorityFromGap(rating, nextRatingObj.target),
      actions: nextRatingObj.actions,
      goalTitle: `Reach ${nextRatingObj.target} Codeforces rating`,
      goalCategory: "Codeforces",
      targetNumber: String(nextRatingObj.target - rating),
      gap: (nextRatingObj.target - rating) / nextRatingObj.target,
      weakArea: ratingWeakArea,
    });

    const nextContests = getNextContestMilestone(contests);
    recs.push({
      id: "codeforces-contests",
      platform: "Codeforces",
      metric: "Contests",
      title: `Participate in ${nextContests} Codeforces contests`,
      description: `You have competed in ${contests} contests. Participate in active contest setups for real rating calibration.`,
      current: `${contests}`,
      target: `${nextContests}`,
      priority: priorityFromGap(contests, nextContests),
      actions: ["Enter upcoming rounds, review editorial, and upsolve at least one problem you couldn't solve."],
      goalTitle: `Complete ${nextContests} Codeforces contests`,
      goalCategory: "Codeforces",
      targetNumber: String(nextContests - contests),
      gap: (nextContests - contests) / nextContests,
      weakArea: "Inconsistent contest participation; lacks simulated contest pressure practice.",
    });
  }

  if (data.codechefStats.username) {
    const rating = data.codechefStats.currentRating || 0;
    const contests = data.codechefStats.contestCount || 0;
    const solved = data.codechefStats.problemsSolved || 0;
    const stars = data.codechefStats.stars || "1★";

    const nextSolved = getNextProblemMilestone(solved);
    recs.push({
      id: "codechef-problems",
      platform: "CodeChef",
      metric: "Problems",
      title: `Solve ${nextSolved} problems on CodeChef`,
      description: `You have solved ${solved} problems. Solve more problems to cover a wider layout of competitive scenarios.`,
      current: `${solved}`,
      target: `${nextSolved}`,
      priority: priorityFromGap(solved, nextSolved),
      actions: ["Solve starter and practice problems on CodeChef logic topics."],
      goalTitle: `Solve ${nextSolved} CodeChef problems`,
      goalCategory: "CodeChef",
      targetNumber: String(nextSolved - solved),
      gap: (nextSolved - solved) / nextSolved,
      weakArea: "Low code depth on CodeChef platform.",
    });

    const nextRatingObj = getNextCodeChefRatingTarget(rating);
    recs.push({
      id: "codechef-rating",
      platform: "CodeChef",
      metric: "Rating",
      title: `Aim for CodeChef ${nextRatingObj.target} (${nextRatingObj.rank})`,
      description: `Your rating is ${rating} (${stars}). Focus on timed solvers to step up to ${nextRatingObj.target}.`,
      current: `${rating}`,
      target: `${nextRatingObj.target} (${nextRatingObj.rank})`,
      priority: priorityFromGap(rating, nextRatingObj.target),
      actions: nextRatingObj.actions,
      goalTitle: `Reach CodeChef ${nextRatingObj.target} rating`,
      goalCategory: "CodeChef",
      targetNumber: String(nextRatingObj.target - rating),
      gap: (nextRatingObj.target - rating) / nextRatingObj.target,
      weakArea: nextRatingObj.target <= 1600
        ? "Difficulty with basic implementation, strings, and introductory prefix sums."
        : "Difficulty with advanced dynamic programming and graph structures under contest conditions.",
    });

    const nextContests = getNextContestMilestone(contests);
    recs.push({
      id: "codechef-contests",
      platform: "CodeChef",
      metric: "Contests",
      title: `Participate in ${nextContests} CodeChef contests`,
      description: `You have completed ${contests} contests. Participate regularly to stabilize your rating.`,
      current: `${contests}`,
      target: `${nextContests}`,
      priority: priorityFromGap(contests, nextContests),
      actions: ["Participate in upcoming Starters rounds and practice the post-contest problems."],
      goalTitle: `Complete ${nextContests} CodeChef contests`,
      goalCategory: "CodeChef",
      targetNumber: String(nextContests - contests),
      gap: (nextContests - contests) / nextContests,
      weakArea: "Lacks consistent contest attendance to benchmark performance.",
    });
  }

  if (data.leetcodeStats.username) {
    const solved = data.leetcodeStats.problemsSolved || 0;
    const rating = data.leetcodeStats.contestRating || 0;
    const contests = data.leetcodeStats.contestCount || 0;

    const nextSolved = getNextProblemMilestone(solved);
    recs.push({
      id: "leetcode-problems",
      platform: "LeetCode",
      metric: "Problems",
      title: `Solve ${nextSolved} problems on LeetCode`,
      description: `You have solved ${solved} problems. Solve more Easy/Medium interview classics to master key patterns.`,
      current: `${solved}`,
      target: `${nextSolved}`,
      priority: priorityFromGap(solved, nextSolved),
      actions: ["Solve a balanced mix across Arrays, Trees, DP, and Graphs on LeetCode."],
      goalTitle: `Solve ${nextSolved} LeetCode problems`,
      goalCategory: "LeetCode",
      targetNumber: String(nextSolved - solved),
      gap: (nextSolved - solved) / nextSolved,
      weakArea: "Limited coverage of core interview topics (arrays, trees, stack, DP).",
    });

    const nextRatingObj = getNextLeetCodeRatingTarget(rating);
    let leetcodeWeakArea = "Struggling to crack hard contest Q4 questions (advanced graphs, tries, and segment trees).";
    if (nextRatingObj.target <= 1600) {
      leetcodeWeakArea = "Inability to solve contest Easy/Medium Q1/Q2 fast and cleanly.";
    } else if (nextRatingObj.target <= 1850) {
      leetcodeWeakArea = "Difficulty solving intermediate Medium contest Q2/Q3 (binary search, sliding window, basic DP).";
    }

    recs.push({
      id: "leetcode-rating",
      platform: "LeetCode",
      metric: "Rating",
      title: `Improve LeetCode rating to ${nextRatingObj.target} (${nextRatingObj.rank})`,
      description: `Your contest rating is ${rating}. Focus on speed to step up to ${nextRatingObj.target}.`,
      current: `${rating}`,
      target: `${nextRatingObj.target} (${nextRatingObj.rank})`,
      priority: priorityFromGap(rating, nextRatingObj.target),
      actions: nextRatingObj.actions,
      goalTitle: `Reach ${nextRatingObj.target} LeetCode rating`,
      goalCategory: "LeetCode",
      targetNumber: String(nextRatingObj.target - rating),
      gap: (nextRatingObj.target - rating) / nextRatingObj.target,
      weakArea: leetcodeWeakArea,
    });

    const nextContests = getNextContestMilestone(contests);
    recs.push({
      id: "leetcode-contests",
      platform: "LeetCode",
      metric: "Contests",
      title: `Participate in ${nextContests} LeetCode contests`,
      description: `You have participated in ${contests} contests. Timed contest sets build excellent interview pressure capacity.`,
      current: `${contests}`,
      target: `${nextContests}`,
      priority: priorityFromGap(contests, nextContests),
      actions: ["Attempt the Weekly and Biweekly contests. Focus on solving at least 3 problems within the time limit."],
      goalTitle: `Complete ${nextContests} LeetCode contests`,
      goalCategory: "LeetCode",
      targetNumber: String(nextContests - contests),
      gap: (nextContests - contests) / nextContests,
      weakArea: "Insufficient experience with timed interview coding formats.",
    });
  }

  return recs
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 5)
    .map(({ gap, ...recommendation }) => recommendation);
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-muted/10 p-3">
      <p className="font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-heading text-lg font-black text-foreground">{value}</p>
    </div>
  );
}

export default function Goals() {
  const [activeTab, setActiveTab] = useState<Tab>("goals");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: dashboard, isLoading: isLoadingDashboard } = useDashboard();
  const recommendations = useMemo(() => makeRecommendation(dashboard), [dashboard]);
  const addedRecommendationIds = useMemo(
    () => new Set(goals.map((goal) => goal.id.split("-added-")[0])),
    [goals]
  );

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("codecraft_goals");
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse goals", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("codecraft_goals", JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleAddRecommendationGoal = (recommendation: GoalRecommendation) => {
    if (addedRecommendationIds.has(recommendation.id)) return;

    const newGoal: Goal = {
      id: `${recommendation.id}-added-${Date.now()}`,
      title: recommendation.goalTitle,
      category: recommendation.goalCategory,
      targetNumber: recommendation.targetNumber,
      status: "Not Started",
      progress: 0,
    };

    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleCompleteGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, status: "Completed", progress: 100 } : g
      )
    );
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        <PageHeader
          title="Goals & Recommendations"
          description="Track your daily targets and get AI-powered problem suggestions."
        />

        {/* Top Tabs */}
        <div className="flex border-b-2 border-border/60">
          <button
            onClick={() => setActiveTab("goals")}
            className={`flex items-center gap-2 px-6 py-4 font-heading font-semibold text-sm transition-all relative ${
              activeTab === "goals"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Target className="h-4 w-4" />
            My Goals
            {activeTab === "goals" && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`flex items-center gap-2 px-6 py-4 font-heading font-semibold text-sm transition-all relative ${
              activeTab === "recommendations"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Recommendations
            {activeTab === "recommendations" && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-heading text-lg font-semibold text-foreground">Active Targets</h2>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="gap-2 rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                  Add Goal
                </Button>
              </div>

              {goals.length === 0 ? (
                <div className="glass rounded-3xl border border-dashed border-border/50 p-12 text-center flex flex-col items-center justify-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/20 border border-border/40">
                    <Flag className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-foreground">No goals added yet</h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      Set a daily target to stay focused on your learning journey.
                    </p>
                  </div>
                  <Button onClick={() => setIsAddModalOpen(true)} variant="outline" className="mt-4 gap-2 rounded-xl">
                    <Plus className="h-4 w-4" /> Create First Goal
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {goals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onComplete={handleCompleteGoal}
                        onDelete={handleDeleteGoal}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "recommendations" && (
            <motion.div
              key="recs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              {isLoadingDashboard ? (
                <div className="glass rounded-3xl border border-border/50 p-12 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 font-mono text-sm text-muted-foreground">Reading your current platform stats...</p>
                </div>
              ) : (
                <>
                  <div className="glass overflow-hidden rounded-3xl border border-border/50">
                    <div className="flex flex-col gap-5 border-b border-border/40 p-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="max-w-2xl">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="font-heading text-xl font-black text-foreground">
                          Recommendation List
                        </h2>
                        <p className="mt-2 font-mono text-sm leading-relaxed text-muted-foreground">
                          Only the biggest below-threshold gaps are shown, based on solved counts, ratings, and contest count.
                        </p>
                      </div>

                      <div className="grid w-full grid-cols-2 gap-3 lg:max-w-md">
                        <StatTile label="Problems" value={dashboard?.heroStats.totalProblems || 0} />
                        <StatTile label="Contests" value={dashboard?.heroStats.totalContests || 0} />
                      </div>
                    </div>

                    {recommendations.length === 0 ? (
                      <div className="p-12 text-center">
                        <h3 className="font-heading text-lg font-bold text-foreground">No recommendations right now</h3>
                        <p className="mt-2 font-mono text-sm text-muted-foreground">
                          Your connected stats are above the current thresholds. Keep maintaining contest consistency.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/35">
                        {recommendations.map((recommendation) => {
                          const isAdded = addedRecommendationIds.has(recommendation.id);

                          return (
                            <motion.div
                              key={recommendation.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="grid grid-cols-1 gap-4 p-5 transition-all hover:bg-white/[0.035] lg:grid-cols-[1fr_auto] lg:items-center"
                            >
                              <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <span className="rounded-full border border-border/50 bg-muted/20 px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {recommendation.platform}
                                  </span>
                                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-primary">
                                    {recommendation.metric}
                                  </span>
                                  <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-amber-300">
                                    {recommendation.current} / {recommendation.target}
                                  </span>
                                </div>
                                <h3 className="font-heading text-base font-black leading-snug text-foreground">
                                  {recommendation.title}
                                </h3>
                                <p className="mt-1 max-w-3xl font-mono text-xs leading-relaxed text-muted-foreground">
                                  {recommendation.description}
                                </p>
                                {recommendation.weakArea && (
                                  <div className="mt-2.5 text-xs font-mono text-rose-500 dark:text-rose-400 font-bold flex items-center gap-1.5 bg-rose-500/5 dark:bg-rose-500/10 w-fit px-2.5 py-1 rounded-lg border border-rose-500/10">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    Weak Area: {recommendation.weakArea}
                                  </div>
                                )}
                                <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                                  {recommendation.actions[0]}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddRecommendationGoal(recommendation)}
                                disabled={isAdded}
                                className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 font-mono text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:border-green-400/25 disabled:bg-green-400/10 disabled:text-green-400"
                              >
                                {isAdded ? <Check className="h-4 w-4" /> : <ListPlus className="h-4 w-4" />}
                                {isAdded ? "Added" : "Add to list"}
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddGoalModal
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddGoal}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
