import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Flame,
  Trophy,
  UserPlus,
  Search,
  Loader2,
  List,
  UserMinus,
  Check,
  X,
  Clock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchFriends,
  fetchFriendsLeaderboard,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  fetchFriendRequests,
  FriendUser,
} from "@/services/friends";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

function initials(name: string) {
  return name
    .split(/[\s_]+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function profilePath(userId: string) {
  return `/profile/${userId}`;
}

export default function Friends() {
  const [search, setSearch] = useState("");
  const [friendListSearch, setFriendListSearch] = useState("");
  const [activeSection, setActiveSection] = useState<"discover" | "friends" | "leaderboard">("discover");
  const queryClient = useQueryClient();

  const { data: friends, isLoading: isLoadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });

  const { data: friendsLeaderboard, isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ["friends-leaderboard"],
    queryFn: fetchFriendsLeaderboard,
    refetchInterval: 30000,
  });

  const { data: friendRequests } = useQuery({
    queryKey: ["friend-requests"],
    queryFn: fetchFriendRequests,
  });

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ["users-search", search],
    queryFn: () => searchUsers(search),
    enabled: search.length >= 1,
    staleTime: 500,
  });

  const invalidateSocial = () => {
    queryClient.invalidateQueries({ queryKey: ["friends"] });
    queryClient.invalidateQueries({ queryKey: ["friends-leaderboard"] });
    queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
    queryClient.invalidateQueries({ queryKey: ["users-search"] });
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
  };

  const requestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (data) => {
      invalidateSocial();
      toast.success(data.message || "Friend request sent!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send friend request");
    },
  });

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      invalidateSocial();
      toast.success("Friend request accepted!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to accept request");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      invalidateSocial();
      toast.success("Friend request rejected");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject request");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      invalidateSocial();
      toast.success("Friend request cancelled");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel request");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      invalidateSocial();
      toast.success("Friend removed");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove friend");
    },
  });

  const filteredFriends = friends?.filter((f) =>
    f.username.toLowerCase().includes(friendListSearch.toLowerCase())
  ) || [];

  const globalResults = searchResults?.filter(
    (u) => u.friendStatus !== "friends"
  ) || [];

  const leaderboardData = friendsLeaderboard || [];

  const hasPendingRequests =
    (friendRequests?.received?.length || 0) > 0 ||
    (friendRequests?.sent?.length || 0) > 0;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8 pb-20 px-4">
        <PageHeader
          title="Study Circle"
          description="Find other members and track your coding streaks together."
        />

        {/* ── Premium Section Nav ── */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-white/[0.03] rounded-2xl border border-white/8 backdrop-blur-xl">
          <button
            onClick={() => setActiveSection("discover")}
            className={cn(
              "flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-mono text-sm font-bold transition-all duration-300",
              activeSection === "discover"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <UserPlus className="h-4 w-4" />
            Discover
          </button>

          <button
            onClick={() => setActiveSection("friends")}
            className={cn(
              "flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-mono text-sm font-bold transition-all duration-300",
              activeSection === "friends"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <List className="h-4 w-4" />
            My Friends
            {(friends?.length ?? 0) > 0 && (
              <span className={cn(
                "ml-1 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center",
                activeSection === "friends" ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
              )}>
                {friends?.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection("leaderboard")}
            className={cn(
              "flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-mono text-sm font-bold transition-all duration-300",
              activeSection === "leaderboard"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <Trophy className="h-4 w-4" />
            Circle Board
          </button>
        </div>

        {hasPendingRequests && (
          <FriendRequestsPanel
            received={friendRequests?.received || []}
            sent={friendRequests?.sent || []}
            onAccept={(id) => acceptMutation.mutate(id)}
            onReject={(id) => rejectMutation.mutate(id)}
            onCancel={(id) => cancelMutation.mutate(id)}
            isAccepting={acceptMutation.isPending}
            isRejecting={rejectMutation.isPending}
            isCancelling={cancelMutation.isPending}
          />
        )}

        <AnimatePresence mode="wait">
          {activeSection === "discover" && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="max-w-xl relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </div>
                <input
                  type="text"
                  placeholder="Search username to add..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 font-mono text-sm text-white backdrop-blur-sm transition-all focus:bg-white/10 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              {search.length < 2 ? (
                <EmptyDiscover />
              ) : globalResults.length > 0 ? (
                <div className="space-y-4 pt-4 border-t border-dashed border-white/10">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-primary/80 px-1">Global Results</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {globalResults.map((user) => (
                      <UserCard
                        key={user._id}
                        user={user}
                        isFriend={false}
                        friendStatus={user.friendStatus}
                        onAdd={() => requestMutation.mutate(user._id)}
                        onAccept={() => acceptMutation.mutate(user._id)}
                        onCancel={() => cancelMutation.mutate(user._id)}
                        isAdding={requestMutation.isPending && requestMutation.variables === user._id}
                        isAccepting={acceptMutation.isPending && acceptMutation.variables === user._id}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-12 text-center">
                  <p className="font-mono text-sm font-bold text-white">No matching users found</p>
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">Try a different username.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === "friends" && (
            <motion.div
              key="friend-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <FriendListPanel
                friends={filteredFriends}
                totalFriends={friends?.length || 0}
                search={friendListSearch}
                onSearch={setFriendListSearch}
                isLoading={isLoadingFriends}
                onRemove={(id) => removeMutation.mutate(id)}
                removingId={removeMutation.isPending ? removeMutation.variables : undefined}
              />
            </motion.div>
          )}

          {activeSection === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {isLoadingLeaderboard ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-white/5" />
                  ))}
                </div>
              ) : leaderboardData.length > 0 ? (
                <FriendsLeaderboard users={leaderboardData} />
              ) : (
                <EmptyCircle />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

function FriendRequestsPanel({
  received,
  sent,
  onAccept,
  onReject,
  onCancel,
  isAccepting,
  isRejecting,
  isCancelling,
}: {
  received: FriendUser[];
  sent: FriendUser[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
  isAccepting: boolean;
  isRejecting: boolean;
  isCancelling: boolean;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-xl p-5 space-y-4">
      <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
        <Clock className="h-3.5 w-3.5" />
        Friend Requests
      </h3>

      {received.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Incoming</p>
          {received.map((user) => (
            <div key={user._id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
              <Link to={profilePath(user._id)} className="flex items-center gap-3 min-w-0 hover:opacity-80">
                <Avatar className="h-9 w-9 rounded-xl border border-white/5">
                  {user.profileImage && <AvatarImage src={user.profileImage} className="object-cover" />}
                  <AvatarFallback className="text-[10px] font-black uppercase">{initials(user.username)}</AvatarFallback>
                </Avatar>
                <span className="font-black text-sm truncate">{user.username}</span>
              </Link>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onAccept(user._id)}
                  disabled={isAccepting}
                  className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onReject(user._id)}
                  disabled={isRejecting}
                  className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sent.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Sent</p>
          {sent.map((user) => (
            <div key={user._id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
              <Link to={profilePath(user._id)} className="flex items-center gap-3 min-w-0 hover:opacity-80">
                <Avatar className="h-9 w-9 rounded-xl border border-white/5">
                  {user.profileImage && <AvatarImage src={user.profileImage} className="object-cover" />}
                  <AvatarFallback className="text-[10px] font-black uppercase">{initials(user.username)}</AvatarFallback>
                </Avatar>
                <span className="font-black text-sm truncate">{user.username}</span>
              </Link>
              <button
                onClick={() => onCancel(user._id)}
                disabled={isCancelling}
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyCircle() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-16 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 border border-primary/10">
        <Search className="h-6 w-6 text-primary/40" />
      </div>
      <p className="font-mono text-sm text-white font-bold">Your circle is empty</p>
      <p className="mt-2 font-mono text-[11px] text-muted-foreground max-w-xs mx-auto">
        Search for your friends by username and send them a friend request.
      </p>
    </div>
  );
}

function EmptyDiscover() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-16 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 border border-primary/10">
        <UserPlus className="h-6 w-6 text-primary/40" />
      </div>
      <p className="font-mono text-sm text-white font-bold">Search to find people</p>
      <p className="mt-2 font-mono text-[11px] text-muted-foreground max-w-xs mx-auto">
        Type at least two characters to discover members and send friend requests.
      </p>
    </div>
  );
}

function FriendListPanel({
  friends,
  totalFriends,
  search,
  onSearch,
  isLoading,
  onRemove,
  removingId,
}: {
  friends: FriendUser[];
  totalFriends: number;
  search: string;
  onSearch: (value: string) => void;
  isLoading: boolean;
  onRemove: (id: string) => void;
  removingId?: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-xl">
      <div className="flex flex-col gap-4 border-b border-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-heading text-sm font-black uppercase tracking-widest text-white">Friend List</h3>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            {totalFriends} {totalFriends === 1 ? "friend" : "friends"} connected
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search friend list..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 font-mono text-xs text-white outline-none transition-all focus:bg-white/10 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-44 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
        </div>
      ) : totalFriends === 0 ? (
        <div className="p-5">
          <EmptyCircle />
        </div>
      ) : friends.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <p className="font-mono text-sm font-bold text-white">No friends matched</p>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">Try a different name.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {friends.map((user) => (
            <div key={user._id} className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-white/5">
              <Link to={profilePath(user._id)} className="flex min-w-0 items-center gap-3 hover:opacity-80">
                <Avatar className="h-11 w-11 rounded-2xl border border-white/10">
                  {user.profileImage && <AvatarImage src={user.profileImage} className="object-cover" />}
                  <AvatarFallback className="rounded-2xl bg-primary/10 text-xs font-black uppercase text-primary">
                    {initials(user.username)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate font-heading text-sm font-black text-white">{user.username}</p>
                  <p className="truncate font-mono text-[10px] text-muted-foreground">{user.email}</p>
                </div>
              </Link>

              <button
                onClick={() => onRemove(user._id)}
                disabled={removingId === user._id}
                className="shrink-0 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-wider text-red-400 transition-all hover:bg-red-500 hover:text-white disabled:opacity-60"
              >
                {removingId === user._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FriendsLeaderboard({ users }: { users: FriendUser[] }) {
  const podium = users.slice(0, 3);
  const rest = users.slice(3);

  const podiumColors = [
    { color: "text-yellow-400", border: "border-yellow-400/30", bg: "bg-yellow-400/5", glow: "shadow-[0_0_30px_rgba(250,204,21,0.2)]" },
    { color: "text-slate-300",  border: "border-slate-300/30",  bg: "bg-slate-300/5",  glow: "shadow-[0_0_20px_rgba(203,213,225,0.1)]" },
    { color: "text-amber-600",  border: "border-amber-600/30",  bg: "bg-amber-600/5",  glow: "shadow-[0_0_20px_rgba(180,83,9,0.1)]" },
  ];
  const podiumOrder = [1, 0, 2]; // visual order: 2nd left, 1st center, 3rd right
  const podiumHeights = ["pt-8", "pt-4", "pt-8"];

  return (
    <div className="space-y-6">
      {/* Top-3 podium */}
      {podium.length > 0 && (
        <div className="grid grid-cols-3 gap-3 items-end">
          {podiumOrder.map((pos, visualIdx) => {
            const user = podium[pos];
            if (!user) return <div key={visualIdx} />;
            const c = podiumColors[pos];
            return (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * visualIdx }}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-3xl border p-4 text-center transition-all hover:scale-[1.02]",
                  c.border, c.bg, c.glow, podiumHeights[visualIdx]
                )}
              >
                <div className={cn("absolute -top-3.5 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-background border shadow-md", c.border)}>
                  <span className={cn("font-black text-xs", c.color)}>{pos + 1}</span>
                </div>
                <Avatar className={cn("h-14 w-14 rounded-2xl border-2 shadow-xl", c.border)}>
                  <AvatarImage src={user.profileImage} className="object-cover" />
                  <AvatarFallback className={cn("rounded-2xl font-black text-sm uppercase", c.color)}>
                    {initials(user.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link to={profilePath(user._id)} className={cn("font-black text-sm hover:underline", c.color)}>
                    {user.username}
                  </Link>
                  {user.isMe && (
                    <Badge className="ml-1.5 text-[8px] h-4 py-0 px-1.5 bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest">YOU</Badge>
                  )}
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Zap className={cn("h-3 w-3", c.color)} />
                    <span className={cn("font-heading font-black text-lg tabular-nums", c.color)}>
                      {user.overallScore ?? 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Remaining users */}
      {rest.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          <div className="grid grid-cols-[48px_1fr_auto] gap-4 px-5 py-3 border-b border-white/5 bg-white/[0.02] uppercase tracking-[0.18em] font-mono text-[10px] text-muted-foreground font-black">
            <span className="text-center">Rank</span>
            <span>Coder</span>
            <span className="text-right pr-2">Score</span>
          </div>
          <div className="divide-y divide-white/5">
            {rest.map((user, i) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * i }}
                className={cn("grid grid-cols-[48px_1fr_auto] gap-4 items-center px-5 py-3.5 transition-all hover:bg-white/5", user.isMe && "bg-primary/5 border-l-2 border-l-primary")}
              >
                <span className="text-center font-mono font-black text-sm text-muted-foreground tabular-nums">{i + 4}</span>
                <Link to={profilePath(user._id)} className="flex items-center gap-3 group/u">
                  <Avatar className="h-9 w-9 rounded-xl border border-white/10 transition group-hover/u:border-primary/30 group-hover/u:scale-105">
                    <AvatarImage src={user.profileImage} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-black uppercase">{initials(user.username)}</AvatarFallback>
                  </Avatar>
                  <span className="font-black text-sm text-white group-hover/u:text-primary transition-colors">{user.username}</span>
                  {user.isMe && <Badge className="text-[8px] h-4 py-0 px-1 bg-primary/10 text-primary border-primary/20 font-black uppercase">YOU</Badge>}
                </Link>
                <div className="flex items-center justify-end gap-1.5 pr-2">
                  <Zap className="h-3.5 w-3.5 text-primary/40" />
                  <span className="font-heading font-black text-base tabular-nums text-white">{user.overallScore ?? 0}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserCard({
  user,
  isFriend,
  friendStatus,
  onAdd,
  onAccept,
  onCancel,
  onRemove,
  isAdding,
  isAccepting,
  isRemoving,
  delay = 0,
}: {
  user: FriendUser;
  isFriend: boolean;
  friendStatus?: FriendUser["friendStatus"];
  onAdd?: () => void;
  onAccept?: () => void;
  onCancel?: () => void;
  onRemove?: () => void;
  isAdding?: boolean;
  isAccepting?: boolean;
  isRemoving?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="h-full"
    >
      <Card className="h-full rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 group tilt-card premium-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 relative z-10">
          <Link to={profilePath(user._id)} className="shrink-0 hover:opacity-80 transition-opacity">
            <Avatar className="h-14 w-14 rounded-2xl border-2 border-white/10 shadow-2xl transition-all duration-500 group-hover:border-primary/50 group-hover:scale-105 group-hover:shadow-primary/20">
              {user.profileImage && <AvatarImage src={user.profileImage} className="object-cover" />}
              <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 font-black text-sm text-primary uppercase">
                {initials(user.username)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="min-w-0 flex-1">
            <Link to={profilePath(user._id)} className="block group/link">
              <h4 className="truncate font-heading text-sm sm:text-base font-black text-white group-hover:text-primary transition-colors tracking-tight">
                {user.username}
              </h4>
            </Link>
            <p className="truncate font-mono text-[9px] sm:text-[10px] text-muted-foreground/60 uppercase tracking-tighter font-black">{user.email}</p>
          </div>

          {!isFriend && friendStatus === "request_sent" && (
            <button
              onClick={onCancel}
              disabled={isAdding}
              className="h-10 px-3 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold uppercase text-muted-foreground hover:text-white transition-all"
            >
              Pending
            </button>
          )}

          {!isFriend && friendStatus === "request_received" && (
            <button
              onClick={onAccept}
              disabled={isAccepting}
              className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300"
            >
              {isAccepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          )}

          {!isFriend && (!friendStatus || friendStatus === "none") && (
            <button
              onClick={onAdd}
              disabled={isAdding}
              className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-primary/30 active:scale-90"
            >
              {isAdding ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          )}

          {isFriend && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] pulse-indicator" title="Connected" />
              <button
                onClick={onRemove}
                disabled={isRemoving}
                title="Remove friend"
                className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserMinus className="h-4 w-4" />}
              </button>
            </div>
          )}
        </CardHeader>

        {isFriend && (
          <CardContent className="pt-2 relative z-10">
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-400/10 border border-orange-400/20 flex items-center justify-center shadow-inner">
                  <Flame className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-black opacity-60">Streak</p>
                  <p className="font-mono text-xs font-black text-white tabular-nums">{user.streak || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-black opacity-60">Solved</p>
                  <p className="font-mono text-xs font-black text-white tabular-nums">{user.problemsSolved || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
