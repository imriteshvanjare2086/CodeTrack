import { api } from "@/lib/apiClient";
import { populateUserData } from "./user";

export type FriendUser = {
  _id: string;
  username: string;
  email?: string;
  profileImage?: string;
  streak: number;
  problemsSolved: number;
  platformStats?: Record<string, number>;
  online?: boolean;
  isMe?: boolean;
};

export async function fetchFriends() {
  const res = await api.get("/users/friends");
  let data = res.data as FriendUser[];
  
  data = data.map((u) => {
    const pop = populateUserData(u);
    return { ...u, ...pop };
  });

  data.sort((a, b) => b.problemsSolved - a.problemsSolved);

  return data;
}

export async function searchUsers(query: string) {
  const res = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
  let data = res.data as FriendUser[];
  
  data = data.map((u) => {
    const pop = populateUserData(u);
    return { ...u, ...pop };
  });

  return data;
}

export async function addFriend(friendId: string) {
  const res = await api.post("/users/add-friend", { friendId });
  return res.data;
}

