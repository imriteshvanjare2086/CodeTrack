import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { populateUserData } from "@/services/user";

export interface DashboardData {
  profile: any;
  heroStats: {
    totalProblems: number;
    totalSubmissions: number;
    currentStreak: number;
    activeDays: number;
    longestStreak: number;
    level: string;
    badges: any[];
  };
  leetcodeStats: {
    totalSolved: number;
    rating: number;
    contests: number;
    ranking: number;
    acceptanceRate: number;
  };
  codeforcesStats: {
    solved: number;
    rating: number;
    contests: number;
    rank: string;
  };
  codechefStats: {
    solved: number;
    rating: number;
    contests: number;
    stars: number;
  };
  ratingHistory: {
    codeforces: any[];
    leetcode: any[];
  };
  dailyGoal: {
    target: number;
    completed: number;
    label: string;
  };
  leaderboard: any[];
  recommendations: string[];
  stats: any;
}

export function useDashboard(userId?: string) {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", userId],
    queryFn: async () => {
      const endpoint = userId ? `/users/${userId}` : "/user/profile";
      const res = await api.get(endpoint);
      const user = populateUserData(res.data);
      
      const totalProblems = user.problemsSolved;
      
      let calculatedLevel = "Beginner";
      if (totalProblems >= 50) calculatedLevel = "Novice";
      if (totalProblems >= 100) calculatedLevel = "Apprentice";
      if (totalProblems >= 250) calculatedLevel = "Knight";
      if (totalProblems >= 500) calculatedLevel = "Expert";
      if (totalProblems >= 1000) calculatedLevel = "Master";
      if (totalProblems >= 2000) calculatedLevel = "Grandmaster";

      return {
        profile: {
          ...user,
          platformStats: {
            leetcode: user.platformStats?.leetcode || Math.floor(totalProblems * 0.5),
            codeforces: user.platformStats?.codeforces || Math.floor(totalProblems * 0.3),
            codechef: user.platformStats?.codechef || Math.floor(totalProblems * 0.2),
          }
        },
        heroStats: {
          totalProblems: totalProblems,
          totalSubmissions: Math.floor(totalProblems * 2.3),
          currentStreak: user.streak,
          activeDays: user.streak,
          longestStreak: Math.max(user.streak, 32), 
          level: user.rank || calculatedLevel,
          badges: [
            { name: "LeetCode Knight", description: "Top 5% globally", platform: "leetcode" },
            { name: "Codeforces Master", description: "Reached 2100 rating", platform: "codeforces" },
            { name: "CodeChef 4★", description: "Advanced division", platform: "codechef" }
          ]
        },
        leetcodeStats: {
          totalSolved: user.platformStats?.leetcode || 0,
          rating: 0,
          contests: 0,
          ranking: 0,
          acceptanceRate: 0
        },
        codeforcesStats: {
          solved: user.platformStats?.codeforces || 0,
          rating: 0,
          contests: 0,
          rank: "Unrated"
        },
        codechefStats: {
          solved: user.platformStats?.codechef || 0,
          rating: 0,
          contests: 0,
          stars: 0
        },
        ratingHistory: {
          codeforces: [
            { contest: "Round 812", rating: 1200 },
            { contest: "Round 820", rating: 1350 },
            { contest: "Round 835", rating: 1420 },
            { contest: "Round 841", rating: 1400 },
            { contest: "Educational 145", rating: 1550 },
            { contest: "Round 850", rating: 1650 }
          ],
          leetcode: [
            { contest: "Weekly 310", rating: 1500 },
            { contest: "Weekly 315", rating: 1620 },
            { contest: "Biweekly 90", rating: 1750 },
            { contest: "Weekly 325", rating: 1800 },
            { contest: "Weekly 330", rating: 1920 },
            { contest: "Biweekly 100", rating: 1982 }
          ]
        },
        dailyGoal: {
          target: 5,
          completed: 3,
          label: "Problems to solve today",
        },
        leaderboard: [
          { rank: 1, name: "Alex", avatar: "A", score: 25400 },
          { rank: 2, name: "Sarah", avatar: "S", score: 23100 },
          { rank: 3, name: "You", avatar: "Y", score: 21450 },
        ],
        recommendations: [
          "Try solving 2 more dynamic programming problems",
          "Participate in the upcoming Codeforces Div 2 round",
          "Review graph algorithms to improve your rating",
        ],
        stats: user
      };
    },
  });
}

