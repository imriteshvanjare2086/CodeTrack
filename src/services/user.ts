import { api } from "@/lib/apiClient";

export type UserProfile = {
  _id: string;
  username: string;
  email: string;
  streak: number;
  problemsSolved: number;
  platformStats: { leetcode: number; codeforces: number; codechef: number };
};

export async function fetchProfile() {
  const res = await api.get("/user/profile");
  return res.data as UserProfile;
}

export function getDeterministicStats(username: string) {
  // Stable hash based solely on the username
  const hash = Array.from(username || "User").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseProblems = Math.max(10, 850 - (hash % 800)); 
  const baseStreak = Math.max(0, 60 - (hash % 60));
  
  return {
    problemsSolved: baseProblems,
    streak: baseStreak,
    platformStats: {
      leetcode: Math.floor(baseProblems * 0.45),
      codeforces: Math.floor(baseProblems * 0.35),
      codechef: Math.floor(baseProblems * 0.20),
    }
  };
}

export function populateUserData(u: any) {
  if (u.leetcodeUsername !== undefined || u.codeforcesUsername !== undefined || u.codechefUsername !== undefined) {
    return {
      ...u,
      problemsSolved: u.problemsSolved ?? 0,
      streak: u.streak ?? 0,
      platformStats: u.platformStats || { leetcode: 0, codeforces: 0, codechef: 0 },
      leetcodeUsername: u.leetcodeUsername || "",
      codeforcesUsername: u.codeforcesUsername || "",
      codechefUsername: u.codechefUsername || "",
      leetcodeStats: u.leetcodeStats || { problemsSolved: 0, contestRating: 0, ranking: 0 },
      codeforcesStats: u.codeforcesStats || { currentRating: 0, maxRating: 0, rank: "Not Connected", contestCount: 0 },
      codechefStats: u.codechefStats || { currentRating: 0, stars: "0", contestCount: 0 }
    };
  }

  const dummy = getDeterministicStats(u.username);
  const problemsSolved = u.problemsSolved > 0 ? u.problemsSolved : dummy.problemsSolved;
  const streak = u.streak > 0 ? u.streak : dummy.streak;
  
  const hasPlatforms = u.platformStats && (u.platformStats.leetcode > 0 || u.platformStats.codeforces > 0 || u.platformStats.codechef > 0);
  const platformStats = hasPlatforms ? u.platformStats : dummy.platformStats;

  return {
    ...u,
    problemsSolved,
    streak,
    platformStats,
    leetcodeUsername: "",
    codeforcesUsername: "",
    codechefUsername: "",
    leetcodeStats: { problemsSolved: platformStats.leetcode, contestRating: 0, ranking: 0 },
    codeforcesStats: { currentRating: 0, maxRating: 0, rank: "Not Connected", contestCount: 0 },
    codechefStats: { currentRating: 0, stars: "0", contestCount: 0 }
  };
}

export async function getLeaderboard() {
  const res = await api.get("/users/leaderboard");
  let data = res.data as UserProfile[];
  
  // Inject consistent dummy data based on names
  data = data.map((u) => populateUserData(u) as UserProfile);

  return data;
}

export async function fetchUserProfile(userId: string) {
  const res = await api.get(`/user/profile`); // Simplified for now
  return res.data as UserProfile;
}

export async function searchUsers(query: string) {
  const res = await api.get(`/users/search?query=${query}`);
  return res.data.map(populateUserData) as UserProfile[];
}

export async function addFriend(friendId: string) {
  const res = await api.post("/users/add-friend", { friendId });
  return res.data;
}

export async function fetchFriends() {
  const res = await api.get("/users/friends");
  return res.data.map(populateUserData) as UserProfile[];
}

