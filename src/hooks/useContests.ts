import { useQuery } from "@tanstack/react-query";
import { fetchContests } from "@/services/contests";

export function useContests() {
  return useQuery({
    queryKey: ["contests"],
    queryFn: fetchContests,
    refetchInterval: 60000, // Refetch every 60 seconds to keep countdowns and live list fresh
  });
}
