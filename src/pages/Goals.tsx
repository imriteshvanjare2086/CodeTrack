import { useState, useEffect, useMemo, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Sparkles, Plus, Flag, Loader2, Trophy, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Goal } from "@/components/goals/types";
import { GoalCard } from "@/components/goals/GoalCard";
import { AddGoalModal } from "@/components/goals/AddGoalModal";
import { RecommendationCard, type GoalRecommendation } from "@/components/goals/RecommendationCard";
import { useDashboard, type DashboardData } from "@/hooks/useDashboard";

type Tab = "goals" | "recommendations";

function parseStars(stars?: string) {
  const match = String(stars || "0").match(/[1-7]/);
  return match ? Number(match[0]) : 0;
}

function priorityFromGap(current: number, target: number): GoalRecommendation["priority"] {
  const ratio = target > 0 ? current / target : 1;
  if (ratio >= 1) return "Done";
  if (ratio < 0.5) return "High";
  if (ratio < 0.8) return "Medium";
  return "Low";
}

function makeRecommendation(data?: DashboardData): GoalRecommendation[] {
  if (!data) return [];

  const recs: GoalRecommendation[] = [];
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
        actions: ["Connect at least one platform from your profile page.", "Sync again after connecting so goals can become personalized."],
        goalTitle: "Connect coding profiles",
        goalCategory: "Competitive Programming",
        targetNumber: "3",
      },
    ];
  }

  const totalProblems = data.heroStats.totalProblems || 0;
  const totalContests = data.heroStats.totalContests || 0;

  if (totalProblems < 300) {
    recs.push({
      id: "overall-problems",
      platform: "Overall",
      metric: "Problems",
      title: "Build a stronger solved-problem base",
      description: "A 300-problem base is a practical threshold for stronger pattern recognition across arrays, graphs, DP, greedy, and trees.",
      current: `${totalProblems}`,
      target: "300",
      priority: priorityFromGap(totalProblems, 300),
      actions: ["Solve 25 mixed DSA problems this month.", "Keep a 60/30/10 split across medium, easy, and hard problems."],
      goalTitle: "Reach 300 total solved problems",
      goalCategory: "DSA",
      targetNumber: String(Math.max(25, 300 - totalProblems)),
    });
  }

  if (totalContests < 15) {
    recs.push({
      id: "overall-contests",
      platform: "Overall",
      metric: "Contests",
      title: "Increase real contest exposure",
      description: "Around 15 contests is a useful minimum before rating becomes stable enough to diagnose speed, accuracy, and topic gaps.",
      current: `${totalContests}`,
      target: "15",
      priority: priorityFromGap(totalContests, 15),
      actions: ["Join one rated contest every week.", "Upsolve at least two missed problems within 48 hours."],
      goalTitle: "Participate in 15 total contests",
      goalCategory: "Competitive Programming",
      targetNumber: String(Math.max(1, 15 - totalContests)),
    });
  }

  if (data.codeforcesStats.username) {
    const rating = data.codeforcesStats.currentRating || 0;
    const solved = data.codeforcesStats.problemsSolved || 0;
    const contests = data.codeforcesStats.contestCount || 0;
    const rank = data.codeforcesStats.rank || "Unrated";

    if (rating < 1600) {
      recs.push({
        id: "codeforces-rating",
        platform: "Codeforces",
        metric: "Rating",
        title: rating < 1200 ? "Move beyond Codeforces Newbie" : "Push toward Codeforces Expert",
        description: "Codeforces Expert at 1600 is a strong threshold. If you are below it, prioritize speed on A/B/C and consistent upsolving.",
        current: rating > 0 ? `${rating} (${rank})` : rank,
        target: "1600 Expert",
        priority: priorityFromGap(rating, 1600),
        actions: ["Practice Div. 2 A-C problems under a 45-minute timer.", "After every contest, upsolve the first unsolved problem before starting new practice."],
        goalTitle: "Reach Codeforces Expert",
        goalCategory: "Codeforces",
        targetNumber: String(Math.max(100, 1600 - rating)),
      });
    } else {
      recs.push({
        id: "codeforces-rating-done",
        platform: "Codeforces",
        metric: "Rating",
        title: "Codeforces rank is in good standing",
        description: "You are at Expert level or above, so rating improvement does not need to be the main focus right now.",
        current: `${rating} (${rank})`,
        target: "Expert+",
        priority: "Done",
        actions: ["Maintain contest consistency and focus on harder C/D upsolves."],
        goalTitle: "Maintain Codeforces Expert level",
        goalCategory: "Codeforces",
      });
    }

    if (contests < 10) {
      recs.push({
        id: "codeforces-contests",
        platform: "Codeforces",
        metric: "Contests",
        title: "Stabilize your Codeforces rating",
        description: "Fewer than 10 Codeforces contests makes the rank noisy. More contests will make your rating and weaknesses clearer.",
        current: `${contests}`,
        target: "10",
        priority: priorityFromGap(contests, 10),
        actions: ["Enter the next 3 Div. 2 or Div. 3 rounds.", "Review wrong submissions immediately after the contest."],
        goalTitle: "Complete 10 Codeforces contests",
        goalCategory: "Codeforces",
        targetNumber: String(Math.max(1, 10 - contests)),
      });
    }

    if (solved < 200) {
      recs.push({
        id: "codeforces-problems",
        platform: "Codeforces",
        metric: "Problems",
        title: "Grow your Codeforces problemset depth",
        description: "A 200-problem Codeforces base is a sensible threshold before expecting stable rating jumps.",
        current: `${solved}`,
        target: "200",
        priority: priorityFromGap(solved, 200),
        actions: ["Solve 10 problems each from 800, 900, 1000, and 1100 rating bands.", "Tag mistakes by topic after every practice block."],
        goalTitle: "Solve 200 Codeforces problems",
        goalCategory: "Codeforces",
        targetNumber: String(Math.max(20, 200 - solved)),
      });
    }
  } else {
    recs.push({
      id: "connect-codeforces",
      platform: "Codeforces",
      metric: "Rank",
      title: "Connect Codeforces for rank recommendations",
      description: "Codeforces data is the best signal for competitive programming rank, contest stability, and timed problem-solving speed.",
      current: "Not connected",
      target: "Connected",
      priority: "Medium",
      actions: ["Add your Codeforces handle in profile sync.", "Run a sync after connecting the account."],
      goalTitle: "Connect Codeforces profile",
      goalCategory: "Codeforces",
      targetNumber: "1",
    });
  }

  if (data.codechefStats.username) {
    const stars = parseStars(data.codechefStats.stars);
    const rating = data.codechefStats.currentRating || 0;
    const contests = data.codechefStats.contestCount || 0;

    if (stars < 3 && rating < 1600) {
      recs.push({
        id: "codechef-stars",
        platform: "CodeChef",
        metric: "Rank",
        title: "Climb to CodeChef 3 star",
        description: "3 star, roughly 1600 rating, is a reasonable threshold. Below that, focus on Starters and clean implementation.",
        current: stars > 0 ? `${stars} star (${rating})` : `${rating || "Unrated"}`,
        target: "3 star / 1600",
        priority: priorityFromGap(rating, 1600),
        actions: ["Play recent Starters and upsolve the first unsolved problem.", "Practice implementation-heavy greedy and math problems."],
        goalTitle: "Reach CodeChef 3 star",
        goalCategory: "CodeChef",
        targetNumber: String(Math.max(100, 1600 - rating)),
      });
    } else {
      recs.push({
        id: "codechef-stars-done",
        platform: "CodeChef",
        metric: "Rank",
        title: "CodeChef star level is healthy",
        description: "You are at 3 star or better, so CodeChef rank improvement is not urgent right now.",
        current: `${stars} star (${rating})`,
        target: "3 star+",
        priority: "Done",
        actions: ["Keep contests regular and move attention to harder upsolves."],
        goalTitle: "Maintain CodeChef 3 star level",
        goalCategory: "CodeChef",
      });
    }

    if (contests < 8) {
      recs.push({
        id: "codechef-contests",
        platform: "CodeChef",
        metric: "Contests",
        title: "Play more CodeChef Starters",
        description: "At least 8 CodeChef contests gives enough data to judge speed and rating direction.",
        current: `${contests}`,
        target: "8",
        priority: priorityFromGap(contests, 8),
        actions: ["Join the next 4 Starters contests.", "Upsolve one additional problem after each contest."],
        goalTitle: "Complete 8 CodeChef contests",
        goalCategory: "CodeChef",
        targetNumber: String(Math.max(1, 8 - contests)),
      });
    }
  }

  if (data.leetcodeStats.username) {
    const solved = data.leetcodeStats.problemsSolved || 0;
    const rating = data.leetcodeStats.contestRating || 0;
    const ranking = data.leetcodeStats.ranking || 0;
    const contests = data.leetcodeStats.contestCount || 0;

    if (solved < 250) {
      recs.push({
        id: "leetcode-problems",
        platform: "LeetCode",
        metric: "Problems",
        title: "Strengthen LeetCode coverage",
        description: "250 solved LeetCode problems is a sensible baseline for interviews and contest pattern coverage.",
        current: `${solved}`,
        target: "250",
        priority: priorityFromGap(solved, 250),
        actions: ["Solve 15 medium problems across arrays, graphs, DP, and binary search.", "Revisit failed problems after 7 days."],
        goalTitle: "Solve 250 LeetCode problems",
        goalCategory: "LeetCode",
        targetNumber: String(Math.max(20, 250 - solved)),
      });
    }

    if (rating > 0 && rating < 1700) {
      recs.push({
        id: "leetcode-rating",
        platform: "LeetCode",
        metric: "Rating",
        title: "Improve LeetCode contest rating",
        description: "A 1700 LeetCode contest rating is a practical threshold for consistent contest performance.",
        current: `${rating}`,
        target: "1700",
        priority: priorityFromGap(rating, 1700),
        actions: ["Attempt Weekly or Biweekly contests regularly.", "Upsolve the first unsolved contest question the same day."],
        goalTitle: "Reach 1700 LeetCode rating",
        goalCategory: "LeetCode",
        targetNumber: String(Math.max(100, 1700 - rating)),
      });
    }

    if (ranking > 200000) {
      recs.push({
        id: "leetcode-ranking",
        platform: "LeetCode",
        metric: "Ranking",
        title: "Bring LeetCode global ranking under 200k",
        description: "Lower ranking is better on LeetCode. Under 200k is a good near-term threshold for steady problem progress.",
        current: `#${ranking.toLocaleString()}`,
        target: "Top 200k",
        priority: ranking > 500000 ? "High" : "Medium",
        actions: ["Keep a weekly streak of 20 solved problems.", "Prioritize medium problems with high acceptance volume."],
        goalTitle: "Reach top 200k LeetCode ranking",
        goalCategory: "LeetCode",
        targetNumber: String(Math.max(1, ranking - 200000)),
      });
    }

    if (contests < 10) {
      recs.push({
        id: "leetcode-contests",
        platform: "LeetCode",
        metric: "Contests",
        title: "Build LeetCode contest consistency",
        description: "Ten contests is a useful minimum before rating and ranking trends become meaningful.",
        current: `${contests}`,
        target: "10",
        priority: priorityFromGap(contests, 10),
        actions: ["Join the next Weekly or Biweekly contest.", "Write down why each missed question was missed."],
        goalTitle: "Complete 10 LeetCode contests",
        goalCategory: "LeetCode",
        targetNumber: String(Math.max(1, 10 - contests)),
      });
    }
  }

  return recs.sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2, Done: 3 };
    return order[a.priority] - order[b.priority];
  }).slice(0, 9);
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-muted/10 p-3">
      <p className="font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-heading text-lg font-black text-foreground">{value}</p>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  detail,
}: {
  icon: ReactNode;
  title: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="glass rounded-2xl border border-border/50 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
          <p className="mt-2 font-heading text-3xl font-black text-foreground">{value}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{detail}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Goals() {
  const [activeTab, setActiveTab] = useState<Tab>("goals");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: dashboard, isLoading: isLoadingDashboard } = useDashboard();
  const recommendations = useMemo(() => makeRecommendation(dashboard), [dashboard]);

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
    const newGoal: Goal = {
      id: `${recommendation.id}-${Date.now()}`,
      title: recommendation.goalTitle,
      category: recommendation.goalCategory,
      targetNumber: recommendation.targetNumber,
      status: "Not Started",
      progress: 0,
    };

    setGoals((prev) => [newGoal, ...prev]);
    setActiveTab("goals");
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
                  <div className="glass rounded-3xl border border-border/50 p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="max-w-2xl">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="font-heading text-xl font-black text-foreground">
                          Stats-based recommendations
                        </h2>
                        <p className="mt-2 font-mono text-sm leading-relaxed text-muted-foreground">
                          These suggestions compare your current solved counts, contest counts, ratings, ranks, and stars against practical improvement thresholds.
                        </p>
                      </div>

                      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-xl">
                        <StatTile label="Problems" value={dashboard?.heroStats.totalProblems || 0} />
                        <StatTile label="Contests" value={dashboard?.heroStats.totalContests || 0} />
                        <StatTile label="Best Rating" value={dashboard?.heroStats.highestRating || 0} />
                        <StatTile label="Best Rank" value={dashboard?.heroStats.highestRank || "None"} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <SummaryCard
                      icon={<TrendingUp className="h-5 w-5" />}
                      title="Improve First"
                      value={recommendations.filter((r) => r.priority === "High").length}
                      detail="High-priority gaps"
                    />
                    <SummaryCard
                      icon={<Target className="h-5 w-5" />}
                      title="Near Target"
                      value={recommendations.filter((r) => r.priority === "Medium" || r.priority === "Low").length}
                      detail="Useful next pushes"
                    />
                    <SummaryCard
                      icon={<Trophy className="h-5 w-5" />}
                      title="Already Healthy"
                      value={recommendations.filter((r) => r.priority === "Done").length}
                      detail="Thresholds cleared"
                    />
                  </div>

                  {recommendations.length === 0 ? (
                    <div className="glass rounded-3xl border border-dashed border-border/50 p-12 text-center">
                      <h3 className="font-heading text-lg font-bold text-foreground">No gaps found right now</h3>
                      <p className="mt-2 font-mono text-sm text-muted-foreground">
                        Your connected stats are above the current thresholds. Keep maintaining contest consistency.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {recommendations.map((recommendation) => (
                        <RecommendationCard
                          key={recommendation.id}
                          recommendation={recommendation}
                          onAddGoal={handleAddRecommendationGoal}
                        />
                      ))}
                    </div>
                  )}
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
