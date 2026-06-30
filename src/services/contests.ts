import { api } from "@/lib/apiClient";

export type ContestPlatform = "leetcode" | "codeforces" | "codechef";

export type Contest = {
  id: string;
  title: string;
  platform: ContestPlatform;
  url: string;
  startTime: number; // timestamp in ms
  duration: number; // in seconds
  status: "live" | "upcoming" | "past";
};

export type ContestsResponse = {
  live: Contest[];
  upcoming: Contest[];
  past: Contest[];
};

export async function fetchContests(): Promise<ContestsResponse> {
  const res = await api.get("/contests");
  return res.data;
}
