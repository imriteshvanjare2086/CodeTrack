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
    const rating = data.codeforcesStats.currentRating || 0;
    const solved = data.codeforcesStats.problemsSolved || 0;
    const contests = data.codeforcesStats.contestCount || 0;
    const rank = data.codeforcesStats.rank || "Unrated";

    if (solved < 100) {
      recs.push({
        id: "codeforces-problems",
        platform: "Codeforces",
        metric: "Problems",
        title: "Grow Codeforces problem depth",
        description: "Reach 100 solved Codeforces problems before expecting stable rating jumps.",
        current: `${solved}`,
        target: "100",
        priority: priorityFromGap(solved, 100),
        actions: ["Solve 800-1100 rated problems and tag mistakes by topic."],
        goalTitle: "Solve 100 Codeforces problems",
        goalCategory: "Codeforces",
        targetNumber: String(Math.max(10, 100 - solved)),
        gap: (100 - solved) / 100,
      });
    }

    if (rating > 0 && rating < 1200) {
      recs.push({
        id: "codeforces-rating",
        platform: "Codeforces",
        metric: "Rating",
        title: "Push Codeforces rating to Pupil",
        description: "1200 is a practical first rating threshold. Focus on clean A/B solves and first C upsolves.",
        current: `${rating} (${rank})`,
        target: "1200 Pupil",
        priority: priorityFromGap(rating, 1200),
        actions: ["Practice 800-1100 rated implementation, math, and greedy problems."],
        goalTitle: "Reach Codeforces Pupil",
        goalCategory: "Codeforces",
        targetNumber: String(Math.max(50, 1200 - rating)),
        gap: (1200 - rating) / 1200,
      });
    }

    if (contests < 8) {
      recs.push({
        id: "codeforces-contests",
        platform: "Codeforces",
        metric: "Contests",
        title: "Stabilize your Codeforces rating",
        description: "Eight rated contests gives enough reps to understand speed, accuracy, and topic gaps.",
        current: `${contests}`,
        target: "8",
        priority: priorityFromGap(contests, 8),
        actions: ["Enter upcoming Div. 2 or Div. 3 rounds and upsolve one missed problem."],
        goalTitle: "Complete 8 Codeforces contests",
        goalCategory: "Codeforces",
        targetNumber: String(Math.max(1, 8 - contests)),
        gap: (8 - contests) / 8,
      });
    }
  }

  if (data.codechefStats.username) {
    const rating = data.codechefStats.currentRating || 0;
    const contests = data.codechefStats.contestCount || 0;
    const solved = data.codechefStats.problemsSolved || 0;

    if (solved < 50) {
      recs.push({
        id: "codechef-problems",
        platform: "CodeChef",
        metric: "Problems",
        title: "Strengthen CodeChef practice",
        description: "Reach 50 solved CodeChef problems before prioritizing harder contest pushes.",
        current: `${solved}`,
        target: "50",
        priority: priorityFromGap(solved, 50),
        actions: ["Practice starter-level greedy, implementation, and math problems."],
        goalTitle: "Solve 50 CodeChef problems",
        goalCategory: "CodeChef",
        targetNumber: String(Math.max(10, 50 - solved)),
        gap: (50 - solved) / 50,
      });
    }

    if (rating > 0 && rating < 1400) {
      recs.push({
        id: "codechef-rating",
        platform: "CodeChef",
        metric: "Rating",
        title: "Aim for CodeChef 2 star",
        description: "1400 is a reasonable early CodeChef rating threshold for contest consistency.",
        current: `${rating}`,
        target: "1400",
        priority: priorityFromGap(rating, 1400),
        actions: ["Upsolve the first unsolved Starters problem after each contest."],
        goalTitle: "Reach CodeChef 1400 rating",
        goalCategory: "CodeChef",
        targetNumber: String(Math.max(50, 1400 - rating)),
        gap: (1400 - rating) / 1400,
      });
    }

    if (contests < 6) {
      recs.push({
        id: "codechef-contests",
        platform: "CodeChef",
        metric: "Contests",
        title: "Play more CodeChef Starters",
        description: "Six contests gives enough starter data to judge speed and rating direction.",
        current: `${contests}`,
        target: "6",
        priority: priorityFromGap(contests, 6),
        actions: ["Join upcoming Starters and upsolve one additional problem after each contest."],
        goalTitle: "Complete 6 CodeChef contests",
        goalCategory: "CodeChef",
        targetNumber: String(Math.max(1, 6 - contests)),
        gap: (6 - contests) / 6,
      });
    }
  }

  if (data.leetcodeStats.username) {
    const solved = data.leetcodeStats.problemsSolved || 0;
    const rating = data.leetcodeStats.contestRating || 0;
    const contests = data.leetcodeStats.contestCount || 0;

    if (solved < 75) {
      recs.push({
        id: "leetcode-problems",
        platform: "LeetCode",
        metric: "Problems",
        title: "Strengthen LeetCode coverage",
        description: "75 solved LeetCode problems is a sensible early base before spreading into harder contest goals.",
        current: `${solved}`,
        target: "75",
        priority: priorityFromGap(solved, 75),
        actions: ["Solve a balanced easy/medium mix across arrays, strings, binary search, and DP."],
        goalTitle: "Solve 75 LeetCode problems",
        goalCategory: "LeetCode",
        targetNumber: String(Math.max(10, 75 - solved)),
        gap: (75 - solved) / 75,
      });
    }

    if (rating > 0 && rating < 1500) {
      recs.push({
        id: "leetcode-rating",
        platform: "LeetCode",
        metric: "Rating",
        title: "Improve LeetCode contest rating",
        description: "1500 is a reasonable first LeetCode contest threshold for timed problem solving.",
        current: `${rating}`,
        target: "1500",
        priority: priorityFromGap(rating, 1500),
        actions: ["Attempt Weekly or Biweekly contests and upsolve the first unsolved question."],
        goalTitle: "Reach 1500 LeetCode rating",
        goalCategory: "LeetCode",
        targetNumber: String(Math.max(50, 1500 - rating)),
        gap: (1500 - rating) / 1500,
      });
    }

    if (contests < 5) {
      recs.push({
        id: "leetcode-contests",
        platform: "LeetCode",
        metric: "Contests",
        title: "Build LeetCode contest consistency",
        description: "Five contests is a useful minimum before rating trends become meaningful.",
        current: `${contests}`,
        target: "5",
        priority: priorityFromGap(contests, 5),
        actions: ["Join upcoming Weekly or Biweekly contests and review misses afterward."],
        goalTitle: "Complete 5 LeetCode contests",
        goalCategory: "LeetCode",
        targetNumber: String(Math.max(1, 5 - contests)),
        gap: (5 - contests) / 5,
      });
    }
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
        <div className="flex border-b border-border/40">
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

                      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-xl">
                        <StatTile label="Problems" value={dashboard?.heroStats.totalProblems || 0} />
                        <StatTile label="Contests" value={dashboard?.heroStats.totalContests || 0} />
                        <StatTile label="Best Rating" value={dashboard?.heroStats.highestRating || 0} />
                        <StatTile label="Best Rank" value={dashboard?.heroStats.highestRank || "None"} />
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
