import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { populateUserData } from "@/services/user";

export interface DashboardData {
  profile: any;
  heroStats: {
    totalProblems: number;
    totalContests: number;
    totalSubmissions: number;
    currentStreak: number;
    activeDays: number;
    highestRating: number;
    highestRank: string;
    leetcodeRating?: number;
    codeforcesRating?: number;
    codechefRating?: number;
    leetcodeRank?: string;
    codeforcesRank?: string;
    codechefRank?: string;
    badges: any[];
  };
  leetcodeStats: {
    username: string;
    problemsSolved: number;
    contestRating: number;
    ranking: number;
    contestCount?: number;
    badge?: string;
  };
  codeforcesStats: {
    username: string;
    currentRating: number;
    maxRating: number;
    rank: string;
    contestCount: number;
    problemsSolved?: number;
  };
  codechefStats: {
    username: string;
    currentRating: number;
    stars: string;
    contestCount: number;
    problemsSolved?: number;
  };
  ratingHistory: {
    codeforces: any[];
    leetcode: any[];
    codechef: any[];
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
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const endpoint = userId ? `/users/${userId}` : "/user/profile";
      const res = await api.get(endpoint);
      const user = populateUserData(res.data);
      
      const totalProblems = user.problemsSolved;
      const isConnected = !!(user.leetcodeUsername || user.codeforcesUsername || user.codechefUsername);
      
      let calculatedLevel = "Beginner";
      if (!isConnected) {
        calculatedLevel = "Not Connected";
      } else {
        if (totalProblems >= 50) calculatedLevel = "Novice";
        if (totalProblems >= 100) calculatedLevel = "Apprentice";
        if (totalProblems >= 250) calculatedLevel = "Knight";
        if (totalProblems >= 500) calculatedLevel = "Expert";
        if (totalProblems >= 1000) calculatedLevel = "Master";
        if (totalProblems >= 2000) calculatedLevel = "Grandmaster";
      }

      const badges = [];
      if (user.leetcodeUsername) {
        badges.push({ name: "LeetCode Solver", description: "Connected LeetCode profile", platform: "leetcode" });
        if ((user.leetcodeStats?.problemsSolved || 0) >= 100) {
          badges.push({ name: "LeetCode Knight", description: "Top 5% globally", platform: "leetcode" });
        }
      }
      if (user.codeforcesUsername) {
        badges.push({ name: "Codeforces Competitor", description: "Connected Codeforces profile", platform: "codeforces" });
        if ((user.codeforcesStats?.currentRating || 0) >= 1600) {
          badges.push({ name: "Codeforces Specialist", description: "Reached 1400+ rating", platform: "codeforces" });
        }
        if ((user.codeforcesStats?.currentRating || 0) >= 2100) {
          badges.push({ name: "Codeforces Master", description: "Reached 2100+ rating", platform: "codeforces" });
        }
      }
      if (user.codechefUsername) {
        badges.push({ name: "CodeChef Divisionist", description: "Connected CodeChef profile", platform: "codechef" });
        if ((user.codechefStats?.currentRating || 0) >= 1800) {
          badges.push({ name: "CodeChef 4★", description: "Advanced division", platform: "codechef" });
        }
      }

      // Fetch rating histories, falling back to a single "Current" entry if history array is empty
      const cfHistory = user.codeforcesRatingHistory && user.codeforcesRatingHistory.length > 0
        ? user.codeforcesRatingHistory.map((item: any) => ({ contest: item.contest, rating: item.rating }))
        : (user.codeforcesStats?.currentRating > 0 ? [{ contest: "Current", rating: user.codeforcesStats.currentRating }] : []);

      const lcHistory = user.leetcodeRatingHistory && user.leetcodeRatingHistory.length > 0
        ? user.leetcodeRatingHistory.map((item: any) => ({ contest: item.contest, rating: item.rating }))
        : (user.leetcodeStats?.contestRating > 0 ? [{ contest: "Current", rating: user.leetcodeStats.contestRating }] : []);

      const ccHistory = user.codechefRatingHistory && user.codechefRatingHistory.length > 0
        ? user.codechefRatingHistory.map((item: any) => ({ contest: item.contest, rating: item.rating }))
        : (user.codechefStats?.currentRating > 0 ? [{ contest: "Current", rating: user.codechefStats.currentRating }] : []);

      // Calculate highestRating and highestRank safely (preventing NaN)
      const lc = Number(user.leetcodeStats?.contestRating);
      const lcRating = isNaN(lc) ? 0 : Math.round(lc);

      const cfM = Number(user.codeforcesStats?.maxRating);
      const cfC = Number(user.codeforcesStats?.currentRating);
      const cfRating = Math.max(isNaN(cfM) ? 0 : cfM, isNaN(cfC) ? 0 : cfC);

      const cc = Number(user.codechefStats?.currentRating);
      const ccRating = isNaN(cc) ? 0 : cc;

      const highestRating = isConnected ? Math.max(lcRating, cfRating, ccRating) : 0;

      function getRankScore(rankOrBadge: string): { name: string; score: number } {
        if (!rankOrBadge) return { name: "None", score: 0 };
        const clean = rankOrBadge.trim().toLowerCase();
        if (clean === "none" || clean === "not connected" || clean === "0" || clean === "0★" || clean === "—") {
          return { name: "None", score: 0 };
        }
        
        if (clean === "legendary grandmaster") return { name: "Legendary Grandmaster", score: 100 };
        if (clean === "international grandmaster") return { name: "International Grandmaster", score: 95 };
        if (clean === "grandmaster") return { name: "Grandmaster", score: 90 };
        if (clean === "international master") return { name: "International Master", score: 85 };
        if (clean === "master") return { name: "Master", score: 80 };
        if (clean === "candidate master") return { name: "Candidate Master", score: 70 };
        if (clean === "expert") return { name: "Expert", score: 60 };
        if (clean === "specialist") return { name: "Specialist", score: 50 };
        if (clean === "pupil") return { name: "Pupil", score: 40 };
        if (clean === "newbie") return { name: "Newbie", score: 30 };
        
        if (clean === "guardian") return { name: "Guardian", score: 75 };
        if (clean === "knight") return { name: "Knight", score: 55 };
        
        if (clean.includes("7★") || clean.includes("7 star")) return { name: "7★", score: 90 };
        if (clean.includes("6★") || clean.includes("6 star")) return { name: "6★", score: 80 };
        if (clean.includes("5★") || clean.includes("5 star")) return { name: "5★", score: 70 };
        if (clean.includes("4★") || clean.includes("4 star")) return { name: "4★", score: 60 };
        if (clean.includes("3★") || clean.includes("3 star")) return { name: "3★", score: 50 };
        if (clean.includes("2★") || clean.includes("2 star")) return { name: "2★", score: 40 };
        if (clean.includes("1★") || clean.includes("1 star")) return { name: "1★", score: 30 };

        const numStars = parseInt(clean);
        if (!isNaN(numStars) && numStars >= 1 && numStars <= 7) {
          return { name: `${numStars}★`, score: 20 + numStars * 10 };
        }
        
        const displayName = rankOrBadge.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
        return { name: displayName, score: 10 };
      }

      const lcRank = getRankScore(user.leetcodeStats?.badge);
      const cfRank = getRankScore(user.codeforcesStats?.rank);
      const ccRank = getRankScore(user.codechefStats?.stars);
      
      let highestRank = "None";
      let maxScore = 0;
      
      if (lcRank.score > maxScore) {
        highestRank = lcRank.name;
        maxScore = lcRank.score;
      }
      if (cfRank.score > maxScore) {
        highestRank = cfRank.name;
        maxScore = cfRank.score;
      }
      if (ccRank.score > maxScore) {
        highestRank = ccRank.name;
        maxScore = ccRank.score;
      }

      return {
        profile: user,
        heroStats: {
          totalProblems: totalProblems,
          totalContests: (user.leetcodeStats?.contestCount || 0) + (user.codeforcesStats?.contestCount || 0) + (user.codechefStats?.contestCount || 0),
          totalSubmissions: Math.floor(totalProblems * 2.3),
          currentStreak: user.streak,
          activeDays: user.streak,
          highestRating: highestRating,
          highestRank: highestRank,
          leetcodeRating: user.leetcodeUsername ? lcRating : undefined,
          codeforcesRating: user.codeforcesUsername ? cfRating : undefined,
          codechefRating: user.codechefUsername ? ccRating : undefined,
          leetcodeRank: user.leetcodeUsername && lcRank.name !== "None" ? lcRank.name : undefined,
          codeforcesRank: user.codeforcesUsername && cfRank.name !== "None" ? cfRank.name : undefined,
          codechefRank: user.codechefUsername && ccRank.name !== "None" ? ccRank.name : undefined,
          badges: badges
        },
        leetcodeStats: {
          username: user.leetcodeUsername || "",
          problemsSolved: user.leetcodeStats?.problemsSolved || 0,
          contestRating: user.leetcodeStats?.contestRating || 0,
          ranking: user.leetcodeStats?.ranking || 0,
          contestCount: user.leetcodeStats?.contestCount || 0,
          badge: user.leetcodeStats?.badge || "None"
        },
        codeforcesStats: {
          username: user.codeforcesUsername || "",
          currentRating: user.codeforcesStats?.currentRating || 0,
          maxRating: user.codeforcesStats?.maxRating || 0,
          rank: user.codeforcesStats?.rank || "Not Connected",
          contestCount: user.codeforcesStats?.contestCount || 0,
          problemsSolved: user.codeforcesStats?.problemsSolved || 0
        },
        codechefStats: {
          username: user.codechefUsername || "",
          currentRating: user.codechefStats?.currentRating || 0,
          stars: user.codechefStats?.stars || "0",
          contestCount: user.codechefStats?.contestCount || 0,
          problemsSolved: user.codechefStats?.problemsSolved || 0
        },
        ratingHistory: {
          codeforces: cfHistory,
          leetcode: lcHistory,
          codechef: ccHistory
        },
        dailyGoal: {
          target: isConnected ? 5 : 0,
          completed: isConnected ? 3 : 0,
          label: isConnected ? "Problems to solve today" : "Connect profiles to start goals",
        },
        leaderboard: [
          { rank: 1, name: "Alex", avatar: "A", score: 25400 },
          { rank: 2, name: "Sarah", avatar: "S", score: 23100 },
          { rank: 3, name: "You", avatar: "Y", score: totalProblems * 10 },
        ],
        recommendations: isConnected ? [
          "Try solving 2 more dynamic programming problems",
          "Participate in the upcoming Codeforces Div 2 round",
          "Review graph algorithms to improve your rating",
        ] : [
          "Connect your coding profiles to receive personalized recommendations."
        ],
        stats: user
      };
    },
  });
}

