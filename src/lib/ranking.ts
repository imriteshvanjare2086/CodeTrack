export type LeaderboardUser = {
  _id: string;
  username: string;
  email?: string;
  profileImage?: string;
  streak: number;
  problemsSolved: number;
  platformStats?: Record<string, number>;
  overallScore?: number;
  isMe?: boolean;
  friendStatus?: "friends" | "request_sent" | "request_received" | "none";
};

function getRankScore(rankOrBadge: string | undefined): number {
  if (!rankOrBadge) return 0;
  const clean = rankOrBadge.trim().toLowerCase();
  if (clean === "none" || clean === "not connected" || clean === "0" || clean === "0★" || clean === "—") {
    return 0;
  }

  const rankMap: Record<string, number> = {
    "legendary grandmaster": 100,
    "international grandmaster": 95,
    grandmaster: 90,
    "international master": 85,
    master: 80,
    "candidate master": 70,
    expert: 60,
    specialist: 50,
    pupil: 40,
    newbie: 30,
    guardian: 75,
    knight: 55,
  };

  if (rankMap[clean] !== undefined) return rankMap[clean];
  if (clean.includes("7★") || clean.includes("7 star")) return 90;
  if (clean.includes("6★") || clean.includes("6 star")) return 80;
  if (clean.includes("5★") || clean.includes("5 star")) return 70;
  if (clean.includes("4★") || clean.includes("4 star")) return 60;
  if (clean.includes("3★") || clean.includes("3 star")) return 50;
  if (clean.includes("2★") || clean.includes("2 star")) return 40;
  if (clean.includes("1★") || clean.includes("1 star")) return 30;

  const numStars = parseInt(clean, 10);
  if (!Number.isNaN(numStars) && numStars >= 1 && numStars <= 7) {
    return 20 + numStars * 10;
  }

  return 10;
}

export function calculateOverallScore(user: any): number {
  const problemsSolved = user.problemsSolved || 0;
  const lcRating = user.leetcodeStats?.contestRating || 0;
  const cfRating = Math.max(
    user.codeforcesStats?.maxRating || 0,
    user.codeforcesStats?.currentRating || 0
  );
  const ccRating = user.codechefStats?.currentRating || 0;
  const totalContests =
    (user.leetcodeStats?.contestCount || 0) +
    (user.codeforcesStats?.contestCount || 0) +
    (user.codechefStats?.contestCount || 0);
  const streak = user.streak || 0;
  const highestRankScore = Math.max(
    getRankScore(user.leetcodeStats?.badge),
    getRankScore(user.codeforcesStats?.rank),
    getRankScore(user.codechefStats?.stars)
  );

  return Math.round(
    problemsSolved * 2 +
      lcRating +
      cfRating +
      ccRating +
      streak * 10 +
      totalContests * 5 +
      highestRankScore * 10
  );
}

export function sortByOverallScore<T extends { overallScore?: number; problemsSolved?: number }>(users: T[]): T[] {
  return [...users].sort(
    (a, b) => (b.overallScore || 0) - (a.overallScore || 0) || (b.problemsSolved || 0) - (a.problemsSolved || 0)
  );
}
