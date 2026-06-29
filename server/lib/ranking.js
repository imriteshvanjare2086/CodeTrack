function getRankScore(rankOrBadge) {
  if (!rankOrBadge) return 0;
  const clean = String(rankOrBadge).trim().toLowerCase();
  if (clean === "none" || clean === "not connected" || clean === "0" || clean === "0★" || clean === "—") {
    return 0;
  }

  const rankMap = {
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

export function calculateOverallScore(user) {
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

const LEADERBOARD_FIELDS =
  "username email profileImage problemsSolved streak platformStats leetcodeStats codeforcesStats codechefStats leetcodeUsername codeforcesUsername codechefUsername";

export function toLeaderboardEntry(user, currentUserId) {
  const doc = user.toObject ? user.toObject() : user;
  return {
    _id: doc._id,
    username: doc.username,
    profileImage: doc.profileImage,
    problemsSolved: doc.problemsSolved || 0,
    streak: doc.streak || 0,
    platformStats: doc.platformStats || { leetcode: 0, codeforces: 0, codechef: 0 },
    leetcodeStats: doc.leetcodeStats,
    codeforcesStats: doc.codeforcesStats,
    codechefStats: doc.codechefStats,
    leetcodeUsername: doc.leetcodeUsername,
    codeforcesUsername: doc.codeforcesUsername,
    codechefUsername: doc.codechefUsername,
    overallScore: calculateOverallScore(doc),
    isMe: currentUserId ? doc._id.toString() === currentUserId.toString() : false,
  };
}

export function sortByOverallScore(users, currentUserId) {
  return users
    .map((user) => toLeaderboardEntry(user, currentUserId))
    .sort((a, b) => b.overallScore - a.overallScore || b.problemsSolved - a.problemsSolved);
}

export { LEADERBOARD_FIELDS };
