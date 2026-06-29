import { api } from "@/lib/apiClient";
import { populateUserData } from "./user";
import type { LeaderboardUser } from "@/lib/ranking";

export type FriendUser = LeaderboardUser;

export type FriendRequests = {
  received: FriendUser[];
  sent: FriendUser[];
};

function enrichUser(u: any, currentUserId?: string): FriendUser {
  const pop = populateUserData(u);
  const merged = { ...u, ...pop };
  const localUser = JSON.parse(localStorage.getItem("user") || "null");
  return {
    ...merged,
    overallScore: u.overallScore ?? merged.overallScore,
    isMe: u.isMe ?? merged._id === (currentUserId || localUser?._id),
    friendStatus: u.friendStatus,
  };
}

export async function fetchFriends() {
  const res = await api.get("/users/friends");
  return (res.data as FriendUser[]).map((u) => enrichUser(u));
}

export async function fetchFriendsLeaderboard() {
  const res = await api.get("/users/friends-leaderboard");
  return (res.data as FriendUser[]).map((u) => enrichUser(u));
}

export async function searchUsers(query: string) {
  const res = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
  return (res.data as FriendUser[]).map((u) => enrichUser(u));
}

export async function fetchFriendRequests() {
  const res = await api.get("/users/friend-requests");
  const data = res.data as FriendRequests;
  return {
    received: data.received.map((u) => enrichUser(u)),
    sent: data.sent.map((u) => enrichUser(u)),
  };
}

export async function sendFriendRequest(friendId: string) {
  const res = await api.post("/users/friend-request", { friendId });
  return res.data;
}

export async function addFriend(friendId: string) {
  return sendFriendRequest(friendId);
}

export async function acceptFriendRequest(friendId: string) {
  const res = await api.post("/users/friend-request/accept", { friendId });
  return res.data;
}

export async function rejectFriendRequest(friendId: string) {
  const res = await api.post("/users/friend-request/reject", { friendId });
  return res.data;
}

export async function cancelFriendRequest(friendId: string) {
  const res = await api.post("/users/friend-request/cancel", { friendId });
  return res.data;
}

export async function removeFriend(friendId: string) {
  const res = await api.delete(`/users/friends/${friendId}`);
  return res.data;
}

export async function fetchPublicProfile(userId: string) {
  const res = await api.get(`/users/public/${userId}`);
  return populateUserData(res.data);
}
