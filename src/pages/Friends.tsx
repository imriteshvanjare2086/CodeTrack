import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Flame, 
  Trophy, 
  UserPlus, 
  Search, 
  Loader2, 
  CheckCircle2, 
  Target, 
  Medal, 
  LayoutGrid, 
  List 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchFriends, searchUsers, addFriend, FriendUser } from "@/services/friends";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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

export default function Friends() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "leaderboard">("grid");
  const queryClient = useQueryClient();

  // 1. Fetch current friends
  const { data: friends, isLoading: isLoadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });

  // 2. Search users globally
  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ["users-search", search],
    queryFn: () => searchUsers(search),
    enabled: search.length >= 1,
    staleTime: 500,
  });

  // 3. Add friend mutation
  const addMutation = useMutation({
    mutationFn: addFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users-search"] });
      toast.success("Friend added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add friend");
    }
  });

  const filteredFriends = friends?.filter((f) => 
    f.username.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Exclude people already in friends from search results
  const globalResults = searchResults?.filter(
    (u) => !friends?.some((f) => f._id === u._id)
  ) || [];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8 pb-20">
        <PageHeader
          title="Study Circle"
          description="Find other members and track your coding streaks together."
        />

        {/* Search Bar */}
        <div className="max-w-xl relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-border/60 bg-card/40 pl-11 pr-4 py-3 font-mono text-sm text-foreground backdrop-blur-sm transition-all focus:bg-card/80 focus:ring-2 focus:ring-primary/20 outline-none border-dashed"
          />
        </div>

        {/* Global Search Results Section */}
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
                    onAdd={() => addMutation.mutate(user._id)}
                    isAdding={addMutation.isPending && addMutation.variables === user._id}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Section with Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="space-y-6">
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
                  <UserCard key={user._id} user={user} isFriend={true} delay={i * 0.05} />
                ))}
              </div>
            ) : (
              <EmptyCircle />
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-0 outline-none">
            {isLoadingFriends ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-muted/20" />
                ))}
              </div>
            ) : friends && friends.length > 0 ? (
              <FriendsLeaderboard users={search.length < 2 ? friends : filteredFriends} />
            ) : (
              <EmptyCircle />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
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
        Search for your friends by their name and add them to compare streaks.
      </p>
    </div>
  );
}

function FriendsLeaderboard({ users }: { users: FriendUser[] }) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />;
      case 2: return <Medal className="h-5 w-5 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]" />;
      default: return <span className="text-muted-foreground font-mono text-xs font-black">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-400/5 hover:bg-yellow-400/10 border-yellow-400/20";
      case 2: return "bg-slate-300/5 hover:bg-slate-300/10 border-slate-300/20";
      case 3: return "bg-amber-600/5 hover:bg-amber-600/10 border-amber-600/20";
      default: return "hover:bg-muted/30";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-[2rem] border border-foreground/10 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-2xl premium-border"
    >
      <div className="w-full overflow-x-auto pb-4">
        <Table className="min-w-[500px] lg:min-w-full">
        <TableHeader className="bg-muted/10">
          <TableRow className="hover:bg-transparent border-foreground/5 uppercase tracking-[0.2em] font-mono text-[9px]">
            <TableHead className="w-[80px] text-center font-black">Rank</TableHead>
            <TableHead className="font-black">Coder</TableHead>
            <TableHead className="text-right font-black">Solved</TableHead>
            <TableHead className="text-right font-black">Streak</TableHead>
            <TableHead className="text-right hidden sm:table-cell font-black pr-6">Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow 
              key={user._id} 
              className={cn(
                "group border-foreground/5 transition-all duration-500",
                getRankStyle(index + 1),
                user.isMe && "bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary"
              )}
            >
              <TableCell className="text-center">
                <div className="flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                  {getRankIcon(index + 1)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Link to={`/dashboard/${user._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity py-1">
                    <Avatar className="h-10 w-10 rounded-xl border border-foreground/5 shadow-lg transition-transform duration-500 group-hover:scale-105">
                      {user.profileImage && <AvatarImage src={user.profileImage} className="object-cover" />}
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary uppercase font-black text-[10px]">
                        {initials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-black text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        {user.username}
                        {user.isMe && <Badge className="text-[8px] h-4 py-0 px-1.5 bg-primary/10 text-primary border-primary/20 font-black tracking-widest uppercase">YOU</Badge>}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono hidden sm:block uppercase tracking-tighter opacity-60 font-black">
                        {index === 0 ? "Circuit Leader" : index === 1 ? "Elite" : index === 2 ? "Advanced" : "Rising"}
                      </span>
                    </div>
                  </Link>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2 pr-2">
                  <Target className="h-3.5 w-3.5 text-primary/50" />
                  <span className="font-heading font-black text-base tabular-nums transition-all group-hover:scale-110 group-hover:text-primary">{user.problemsSolved}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2 pr-2">
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded-xl border text-[10px] font-black",
                    user.streak > 0 ? "bg-leetcode/10 text-leetcode border-leetcode/20" : "text-muted-foreground/30 border-foreground/5"
                  )}>
                    <Flame className="h-3 w-3" />
                    <span className="font-mono tabular-nums">{user.streak}d</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right hidden sm:table-cell pr-6">
                <div className="flex items-center justify-end gap-1.5">
                  {Object.entries(user.platformStats || {}).map(([platform, count]) => (
                    <Badge 
                      key={platform} 
                      variant="outline" 
                      className="bg-foreground/5 text-[9px] font-black font-mono py-0 px-1.5 border-foreground/5 group-hover:border-primary/20 transition-colors"
                    >
                      {count as number}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}

function UserCard({ 
  user, 
  isFriend, 
  onAdd, 
  isAdding,
  delay = 0 
}: { 
  user: any; 
  isFriend: boolean; 
  onAdd?: () => void;
  isAdding?: boolean;
  delay?: number
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
          <Link to={`/dashboard/${user._id}`} className="shrink-0 hover:opacity-80 transition-opacity">
            <Avatar className="h-14 w-14 rounded-2xl border-2 border-foreground/10 shadow-2xl transition-all duration-500 group-hover:border-primary/50 group-hover:scale-105 group-hover:shadow-primary/20">
              {user.profileImage && <AvatarImage src={user.profileImage} className="object-cover" />}
              <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 font-black text-sm text-primary uppercase">
                {initials(user.username)}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="min-w-0 flex-1">
            <Link to={`/dashboard/${user._id}`} className="block group/link">
              <h4 className="truncate font-heading text-sm sm:text-base font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                {user.username}
              </h4>
            </Link>
            <p className="truncate font-mono text-[9px] sm:text-[10px] text-muted-foreground/60 uppercase tracking-tighter font-black">{user.email}</p>
          </div>

          {!isFriend && (
            <button
              onClick={onAdd}
              disabled={isAdding}
              className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-primary/30 active:scale-90"
            >
              {isAdding ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          )}
          {isFriend && (
            <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] pulse-indicator" title="Connected" />
          )}
        </CardHeader>

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
      </Card>
    </motion.div>
  );
}

