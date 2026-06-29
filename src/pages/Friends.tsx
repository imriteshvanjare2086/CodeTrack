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
  Target,
  Medal,
  LayoutGrid,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  const [viewMode, setViewMode] = useState<"grid" | "leaderboard">("grid");
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
    f.username.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const globalResults = searchResults?.filter(
    (u) => u.friendStatus !== "friends"
  ) || [];

  const leaderboardData = search.length < 2
    ? (friendsLeaderboard || [])
    : (friendsLeaderboard || []).filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
      );

  const hasPendingRequests =
    (friendRequests?.received?.length || 0) > 0 ||
    (friendRequests?.sent?.length || 0) > 0;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8 pb-20">
        <PageHeader
          title="Study Circle"
          description="Find other members and track your coding streaks together."
        />

        <div className="max-w-xl relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </div>
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-border/60 bg-card/40 pl-11 pr-4 py-3 font-mono text-sm text-foreground backdrop-blur-sm transition-all focus:bg-card/80 focus:ring-2 focus:ring-primary/20 outline-none border-dashed"
          />
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

        <AnimatePresence>
          {search.length >= 2 && globalResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-dashed border-border/40"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "leaderboard")} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Your Circle
              <span className="font-mono text-[10px] text-muted-foreground/60 normal-case tracking-normal">({friends?.length || 0} members)</span>
            </h3>

            <TabsList className="bg-muted/30 border border-border/40 p-1 rounded-xl h-10 w-fit">
              <TabsTrigger
                value="grid"
                className="rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <LayoutGrid className="h-3.5 w-3.5 mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <List className="h-3.5 w-3.5 mr-2" />
                Leaderboard
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="mt-0 space-y-4 outline-none">
            {isLoadingFriends ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border/40 bg-muted/5">
                <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
              </div>
            ) : friends && friends.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(search.length < 2 ? friends : filteredFriends).map((user, i) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    isFriend={true}
                    delay={i * 0.05}
                    onRemove={() => removeMutation.mutate(user._id)}
                    isRemoving={removeMutation.isPending && removeMutation.variables === user._id}
                  />
                ))}
              </div>
            ) : (
              <EmptyCircle />
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-0 outline-none">
            {isLoadingLeaderboard ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-muted/20" />
                ))}
              </div>
            ) : leaderboardData.length > 0 ? (
              <FriendsLeaderboard users={leaderboardData} />
            ) : (
              <EmptyCircle />
            )}
          </TabsContent>
        </Tabs>
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
    <div className="rounded-[2rem] border border-foreground/10 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-xl premium-border p-5 space-y-4">
      <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
        <Clock className="h-3.5 w-3.5" />
        Friend Requests
      </h3>

      {received.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Incoming</p>
          {received.map((user) => (
            <div key={user._id} className="flex items-center justify-between gap-3 rounded-xl border border-foreground/5 bg-muted/10 px-3 py-2">
              <Link to={profilePath(user._id)} className="flex items-center gap-3 min-w-0 hover:opacity-80">
                <Avatar className="h-9 w-9 rounded-xl border border-foreground/5">
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
            <div key={user._id} className="flex items-center justify-between gap-3 rounded-xl border border-foreground/5 bg-muted/10 px-3 py-2">
              <Link to={profilePath(user._id)} className="flex items-center gap-3 min-w-0 hover:opacity-80">
                <Avatar className="h-9 w-9 rounded-xl border border-foreground/5">
                  {user.profileImage && <AvatarImage src={user.profileImage} className="object-cover" />}
                  <AvatarFallback className="text-[10px] font-black uppercase">{initials(user.username)}</AvatarFallback>
                </Avatar>
                <span className="font-black text-sm truncate">{user.username}</span>
              </Link>
              <button
                onClick={() => onCancel(user._id)}
                disabled={isCancelling}
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-muted/30 border border-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
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
    <div className="rounded-3xl border border-dashed border-border/60 bg-muted/5 px-4 py-16 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 border border-primary/10">
        <Search className="h-6 w-6 text-primary/40" />
      </div>
      <p className="font-mono text-sm text-foreground font-bold">Your circle is empty</p>
      <p className="mt-2 font-mono text-[11px] text-muted-foreground max-w-xs mx-auto">
        Search for your friends by username and send them a friend request.
      </p>
    </div>
  );
}

function FriendsLeaderboard({ users }: { users: FriendUser[] }) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />;
      case 2: return <Medal className="h-6 w-6 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]" />;
      case 3: return <Medal className="h-6 w-6 text-amber-600 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]" />;
      default: return <span className="text-muted-foreground font-mono font-black text-sm">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number, isMe?: boolean) => {
    if (isMe) return "bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary";
    switch (rank) {
      case 1: return "bg-yellow-400/5 hover:bg-yellow-400/10 border-yellow-400/20";
      case 2: return "bg-slate-300/5 hover:bg-slate-300/10 border-slate-300/20";
      case 3: return "bg-amber-600/5 hover:bg-amber-600/10 border-amber-600/20";
      default: return "hover:bg-muted/30";
    }
  };

  const getRankLabel = (index: number) => {
    if (index === 0) return "Circuit Leader";
    if (index === 1) return "Elite";
    if (index === 2) return "Advanced";
    return "Rising";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-[2rem] border border-foreground/10 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-2xl premium-border"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.02] to-transparent pointer-events-none" />

      <div className="w-full overflow-x-auto pb-4">
        <Table className="min-w-[560px] lg:min-w-full">
          <TableHeader className="bg-muted/10">
            <TableRow className="hover:bg-transparent border-foreground/5 uppercase tracking-[0.2em] font-mono text-[10px]">
              <TableHead className="w-[80px] sm:w-[100px] text-center font-black">Rank</TableHead>
              <TableHead className="font-black">Coder</TableHead>
              <TableHead className="text-right font-black">Score</TableHead>
              <TableHead className="text-right font-black">Rank Label</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {users.map((user, index) => (
                <motion.tr
                  layout
                  key={user._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "group border-foreground/5 transition-all duration-500 hover:-translate-y-0.5",
                    getRankStyle(index + 1, user.isMe)
                  )}
                >
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      {getRankIcon(index + 1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={profilePath(user._id)}
                      className="flex items-center gap-4 group/user py-2"
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12 rounded-2xl border-2 border-foreground/5 shadow-xl transition-all duration-500 group-hover/user:border-primary/50 group-hover/user:scale-105 group-hover/user:shadow-primary/20">
                          <AvatarImage src={user.profileImage} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary uppercase font-black text-xs">
                            {initials(user.username)}
                          </AvatarFallback>
                        </Avatar>
                        {index < 3 && (
                          <div className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-background rounded-full border border-foreground/10 flex items-center justify-center shadow-lg">
                            <svg className={cn("h-2.5 w-2.5", index === 0 ? "text-yellow-400" : index === 1 ? "text-slate-300" : "text-amber-600")} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-black text-foreground group-hover/user:text-primary transition-colors tracking-tight text-base flex items-center gap-2">
                          {user.username}
                          {user.isMe && (
                            <Badge className="text-[8px] h-4 py-0 px-1.5 bg-primary/10 text-primary border-primary/20 font-black tracking-widest uppercase">YOU</Badge>
                          )}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <Zap className="h-4 w-4 text-primary/50" />
                      <span className="font-heading font-black text-xl text-foreground tabular-nums tracking-tighter transition-all group-hover:scale-110 group-hover:text-primary">
                        {user.overallScore ?? 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end pr-2">
                      <span className={cn(
                        "text-[11px] sm:text-[12px] uppercase tracking-[0.2em] font-mono font-black py-1 px-3 rounded-full w-fit border transition-all duration-300 relative overflow-hidden",
                        index < 3 ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_hsla(var(--primary),0.5)]" : "bg-muted/30 text-muted-foreground border-foreground/5"
                      )}>
                        {index < 3 && (
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-[shineline_2s_infinite] pointer-events-none" />
                        )}
                        {getRankLabel(index)}
                      </span>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </motion.div>
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
      <Card className="h-full rounded-[2rem] border border-foreground/10 bg-card/30 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 group tilt-card premium-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] to-transparent pointer-events-none" />

        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 relative z-10">
          <Link to={profilePath(user._id)} className="shrink-0 hover:opacity-80 transition-opacity">
            <Avatar className="h-14 w-14 rounded-2xl border-2 border-foreground/10 shadow-2xl transition-all duration-500 group-hover:border-primary/50 group-hover:scale-105 group-hover:shadow-primary/20">
              {user.profileImage && <AvatarImage src={user.profileImage} className="object-cover" />}
              <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 font-black text-sm text-primary uppercase">
                {initials(user.username)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="min-w-0 flex-1">
            <Link to={profilePath(user._id)} className="block group/link">
              <h4 className="truncate font-heading text-sm sm:text-base font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                {user.username}
              </h4>
            </Link>
            <p className="truncate font-mono text-[9px] sm:text-[10px] text-muted-foreground/60 uppercase tracking-tighter font-black">{user.email}</p>
          </div>

          {!isFriend && friendStatus === "request_sent" && (
            <button
              onClick={onCancel}
              disabled={isAdding}
              className="h-10 px-3 shrink-0 rounded-2xl bg-muted/30 border border-foreground/10 flex items-center justify-center text-[10px] font-mono font-bold uppercase text-muted-foreground hover:text-foreground transition-all"
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
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-foreground/5 bg-foreground/[0.03] p-4 transition-all duration-500 group-hover:bg-foreground/[0.05] group-hover:border-foreground/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-400/10 border border-orange-400/20 flex items-center justify-center shadow-inner">
                  <Flame className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-black opacity-60">Streak</p>
                  <p className="font-mono text-xs font-black text-foreground tabular-nums">{user.streak || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-black opacity-60">Solved</p>
                  <p className="font-mono text-xs font-black text-foreground tabular-nums">{user.problemsSolved || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
