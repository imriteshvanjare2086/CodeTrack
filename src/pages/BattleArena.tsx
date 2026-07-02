import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Search, Trophy, Loader2, ArrowLeft, Code2, Medal, Star, TrendingUp } from 'lucide-react';
import { api } from '@/lib/apiClient';
import { populateUserData } from '@/services/user';
import { useNavigate } from 'react-router-dom';

interface PlayerStats {
  username: string;
  problemsSolved: number;
  leetcodeSolved: number;
  codeforcesSolved: number;
  codechefSolved: number;
  leetcodeRating: number;
  codeforcesRating: number;
  codechefRating: number;
  leetcodeRanking: number;
  leetcodeContestCount: number;
  codeforcesContestCount: number;
  codechefContestCount: number;
  leetcodeRank: string;
  codeforcesRank: string;
  codechefRank: string;
  badges: number;
  maxStreak: number;
}

export default function BattleArena() {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const [stats1, setStats1] = useState<PlayerStats | null>(null);
  const [stats2, setStats2] = useState<PlayerStats | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [battleStarted, setBattleStarted] = useState(false);
  const navigate = useNavigate();

  const initiateBattle = async () => {
    if (!player1.trim() || !player2.trim()) {
      setError("Please enter both usernames");
      return;
    }

    setIsLoading(true);
    setError(null);
    setBattleStarted(false);

    try {
      const [res1, res2] = await Promise.all([
        api.get(`/user-stats/${player1.trim()}`),
        api.get(`/user-stats/${player2.trim()}`)
      ]);

      const p1Raw = res1.data;
      const p2Raw = res2.data;

      // Ensure data matches dashboard exactly by applying the same deterministic generation
      const p1Populated = populateUserData(p1Raw);
      const p2Populated = populateUserData(p2Raw);

      setStats1({
        username: p1Raw.username,
        problemsSolved: p1Populated.problemsSolved,
        leetcodeSolved: p1Populated.platformStats?.leetcode || 0,
        codeforcesSolved: p1Populated.platformStats?.codeforces || 0,
        codechefSolved: p1Populated.platformStats?.codechef || 0,
        leetcodeRating: Math.round(p1Populated.leetcodeStats?.contestRating || 0),
        codeforcesRating: Math.round(Math.max(p1Populated.codeforcesStats?.currentRating || 0, p1Populated.codeforcesStats?.maxRating || 0)),
        codechefRating: Math.round(p1Populated.codechefStats?.currentRating || 0),
        leetcodeRanking: p1Populated.leetcodeStats?.ranking || 0,
        leetcodeContestCount: p1Populated.leetcodeStats?.contestCount || 0,
        codeforcesContestCount: p1Populated.codeforcesStats?.contestCount || 0,
        codechefContestCount: p1Populated.codechefStats?.contestCount || 0,
        leetcodeRank: p1Populated.leetcodeStats?.badge || "None",
        codeforcesRank: p1Populated.codeforcesStats?.rank || "None",
        codechefRank: p1Populated.codechefStats?.stars || "None",
        badges: Math.floor(p1Populated.problemsSolved / 50) + 2, // Realistic badge count based on problems
        maxStreak: p1Populated.streak || 0,
      });

      setStats2({
        username: p2Raw.username,
        problemsSolved: p2Populated.problemsSolved,
        leetcodeSolved: p2Populated.platformStats?.leetcode || 0,
        codeforcesSolved: p2Populated.platformStats?.codeforces || 0,
        codechefSolved: p2Populated.platformStats?.codechef || 0,
        leetcodeRating: Math.round(p2Populated.leetcodeStats?.contestRating || 0),
        codeforcesRating: Math.round(Math.max(p2Populated.codeforcesStats?.currentRating || 0, p2Populated.codeforcesStats?.maxRating || 0)),
        codechefRating: Math.round(p2Populated.codechefStats?.currentRating || 0),
        leetcodeRanking: p2Populated.leetcodeStats?.ranking || 0,
        leetcodeContestCount: p2Populated.leetcodeStats?.contestCount || 0,
        codeforcesContestCount: p2Populated.codeforcesStats?.contestCount || 0,
        codechefContestCount: p2Populated.codechefStats?.contestCount || 0,
        leetcodeRank: p2Populated.leetcodeStats?.badge || "None",
        codeforcesRank: p2Populated.codeforcesStats?.rank || "None",
        codechefRank: p2Populated.codechefStats?.stars || "None",
        badges: Math.floor(p2Populated.problemsSolved / 50) + 2,
        maxStreak: p2Populated.streak || 0,
      });

      setBattleStarted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch user stats. Ensure both users exist.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateScore = (stats: PlayerStats) => {
    return (stats.problemsSolved * 2) +
      (stats.leetcodeRating) +
      (stats.codeforcesRating) +
      (stats.codechefRating) +
      (stats.maxStreak * 10) +
      (stats.badges * 50);
  };

  let winner = 0; // 0 for draw, 1 for player1, 2 for player2
  if (stats1 && stats2) {
    const score1 = calculateScore(stats1);
    const score2 = calculateScore(stats2);
    if (score1 > score2) winner = 1;
    else if (score2 > score1) winner = 2;
  }

  const totalContests = (stats: PlayerStats) =>
    stats.leetcodeContestCount + stats.codeforcesContestCount + stats.codechefContestCount;

  const displayNumber = (value: number) => value > 0 ? value.toLocaleString() : "None";

  const displayRank = (value: string | number | undefined) => {
    const clean = String(value ?? "").trim();
    if (!clean || clean === "0" || clean === "0★" || clean === "—" || clean.toLowerCase() === "not connected") {
      return "None";
    }
    return clean;
  };

  const renderStatLine = (label: string, value: string | number, tone: "orange" | "blue") => (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-2.5">
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`text-right text-sm font-heading font-black ${tone === "orange" ? "text-orange-500 dark:text-orange-400" : "text-blue-500 dark:text-blue-400"}`}>
        {value}
      </span>
    </div>
  );

  const renderPlayerPanel = (stats: PlayerStats, side: "left" | "right") => {
    const tone = side === "left" ? "orange" : "blue";
    const won = (side === "left" && winner === 1) || (side === "right" && winner === 2);
    const borderClass = side === "left"
      ? "border-orange-200 dark:border-orange-500/30"
      : "border-blue-200 dark:border-blue-500/30";
    const glowClass = side === "left"
      ? "shadow-[0_16px_40px_rgba(249,115,22,0.12)] dark:shadow-[0_16px_45px_rgba(249,115,22,0.18)]"
      : "shadow-[0_16px_40px_rgba(59,130,246,0.12)] dark:shadow-[0_16px_45px_rgba(59,130,246,0.18)]";
    const headingClass = side === "left" ? "text-orange-500 dark:text-orange-400" : "text-blue-500 dark:text-blue-400";
    const iconClass = side === "left" ? "text-orange-500" : "text-blue-500";
    const topBarClass = side === "left" ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-blue-500 to-cyan-500";
    const winnerBg = side === "left" ? "bg-orange-50 dark:bg-orange-500/10" : "bg-blue-50 dark:bg-blue-500/10";
    const totalContestCount = totalContests(stats);

    return (
      <div className={`relative overflow-hidden rounded-3xl bg-white dark:bg-[#111113] border ${borderClass} p-5 sm:p-6 ${glowClass}`}>
        <div className={`absolute inset-x-0 top-0 h-1 ${topBarClass}`} />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className={`mt-1 truncate text-2xl font-heading font-black tracking-tight ${headingClass}`}>
              {stats.username}
            </h3>
          </div>
          {won && (
            <div className={`shrink-0 rounded-full p-2 ${winnerBg}`}>
              <Trophy className={`h-5 w-5 ${headingClass}`} />
            </div>
          )}
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Code2 className="h-4 w-4" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Total Problems</span>
            </div>
            <p className={`mt-3 text-3xl font-heading font-black ${headingClass}`}>
              {stats.problemsSolved.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Medal className="h-4 w-4" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Contests</span>
            </div>
            <p className={`mt-3 text-3xl font-heading font-black ${headingClass}`}>
              {totalContestCount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <TrendingUp className={`h-4 w-4 ${iconClass}`} />
              <h4 className="text-xs font-heading font-black uppercase tracking-widest">All Platform Rating</h4>
            </div>
            <div className="space-y-2">
              {renderStatLine("LeetCode", displayNumber(stats.leetcodeRating), tone)}
              {renderStatLine("Codeforces", displayNumber(stats.codeforcesRating), tone)}
              {renderStatLine("CodeChef", displayNumber(stats.codechefRating), tone)}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Star className={`h-4 w-4 ${iconClass}`} />
              <h4 className="text-xs font-heading font-black uppercase tracking-widest">Ranking</h4>
            </div>
            <div className="space-y-2">
              {renderStatLine("LeetCode Badge", displayRank(stats.leetcodeRank), tone)}
              {renderStatLine("Codeforces", displayRank(stats.codeforcesRank), tone)}
              {renderStatLine("CodeChef Stars", displayRank(stats.codechefRank), tone)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0A0A0B] text-slate-900 dark:text-white p-4 sm:p-8 overflow-x-hidden w-full max-w-full relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Exit Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors group"
      >
        <div className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none group-hover:bg-slate-50 dark:group-hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="font-mono text-[10px] sm:text-sm uppercase tracking-widest font-bold">Exit Arena</span>
      </button>

      <div className="max-w-5xl mx-auto relative z-10 pt-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 ring-1 ring-white/10 shadow-[0_0_30px_rgba(249,115,22,0.3)]"
          >
            <Swords className="w-8 h-8 text-orange-400" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tighter mb-4 px-2"
          >
            Code Battle <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Arena</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 font-mono text-sm tracking-[0.2em] uppercase"
          >
            Compare performance. Find the better coder.
          </motion.p>
        </div>

        {/* Players Input Section */}
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-8 mb-12">
          {/* Player 1 Card */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full md:w-80 group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-20 dark:opacity-30 group-hover:opacity-60 dark:group-hover:opacity-70 transition duration-500" />
            <div className="relative bg-white dark:bg-[#111113] border border-slate-300 dark:border-orange-500/20 p-6 rounded-2xl shadow-lg dark:shadow-[0_0_25px_rgba(249,115,22,0.15)] transition-all">
              <label className="block text-xs font-mono text-orange-500 dark:text-orange-400 font-bold uppercase tracking-widest mb-3">Player 1</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={player1}
                  onChange={(e) => setPlayer1(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/5 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* VS Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="relative z-10 flex-shrink-0 my-4 md:my-0"
          >
            <div className="w-16 h-16 rounded-full bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-black border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.1),inset_0_2px_10px_rgba(255,255,255,0.1)] relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-slate-300 dark:bg-white/5" />
              <span className="font-black italic text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-700 to-slate-400 dark:from-white dark:to-slate-500">VS</span>
            </div>
          </motion.div>

          {/* Player 2 Card */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full md:w-80 group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 dark:opacity-30 group-hover:opacity-60 dark:group-hover:opacity-70 transition duration-500" />
            <div className="relative bg-white dark:bg-[#111113] border border-slate-200 dark:border-blue-500/20 p-6 rounded-2xl shadow-lg dark:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all">
              <label className="block text-xs font-mono text-blue-500 dark:text-blue-400 font-bold uppercase tracking-widest mb-3">Player 2</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={player2}
                  onChange={(e) => setPlayer2(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/5 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Button & Errors */}
        <div className="text-center mb-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initiateBattle}
            disabled={isLoading}
            className="relative group px-8 py-4 rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity bg-[length:200%_auto] animate-[pulse_2s_ease-in-out_infinite]" />
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-orange-500 to-red-500 opacity-40 group-hover:opacity-80 transition-opacity" />
            <div className="relative flex items-center justify-center gap-2 font-heading font-black tracking-wide text-lg text-white">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  INITIATING...
                </>
              ) : (
                <>
                  <Swords className="w-5 h-5" />
                  INITIATE BATTLE
                </>
              )}
            </div>
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-red-400 font-mono text-sm"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {battleStarted && stats1 && stats2 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="relative"
            >
              {/* Winner Banner */}
              <div className="flex justify-center mb-12">
                <div className={`px-8 py-4 rounded-2xl border ${winner === 1 ? 'bg-orange-100 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/50 shadow-[0_0_40px_rgba(249,115,22,0.15)] dark:shadow-[0_0_40px_rgba(249,115,22,0.3)]' :
                    winner === 2 ? 'bg-blue-100 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.15)] dark:shadow-[0_0_40px_rgba(59,130,246,0.3)]' :
                      'bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/20'
                  } backdrop-blur-md`}>
                  <h2 className="text-2xl md:text-3xl font-black font-heading tracking-tighter text-center flex items-center gap-3">
                    {winner === 1 && <Trophy className="w-8 h-8 text-orange-500 dark:text-orange-400" />}
                    {winner === 2 && <Trophy className="w-8 h-8 text-blue-500 dark:text-blue-400" />}

                    {winner === 1 && <span className="text-orange-500 dark:text-orange-400">WINNER: {stats1.username.toUpperCase()}</span>}
                    {winner === 2 && <span className="text-blue-500 dark:text-blue-400">WINNER: {stats2.username.toUpperCase()}</span>}
                    {winner === 0 && <span className="text-slate-500 dark:text-slate-300">IT'S A DRAW</span>}

                    {winner === 1 && <Trophy className="w-8 h-8 text-orange-500 dark:text-orange-400" />}
                    {winner === 2 && <Trophy className="w-8 h-8 text-blue-500 dark:text-blue-400" />}
                  </h2>
                </div>
              </div>

              {/* Side-by-side Player Stats */}
              <div className="bg-white dark:bg-[#1A1A1E] border border-slate-300 dark:border-white/10 rounded-3xl px-5 sm:px-8 pt-3 pb-8 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/30 to-transparent" />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-2 sm:px-4">
                  <div className="text-center font-heading font-black text-xl sm:text-2xl text-orange-500 dark:text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">{stats1.username}</div>
                  <div className="text-center font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center justify-center bg-slate-200 dark:bg-white/10 px-3 py-1 rounded-full">VS</div>
                  <div className="text-center font-heading font-black text-xl sm:text-2xl text-blue-500 dark:text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{stats2.username}</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
                  {renderPlayerPanel(stats1, "left")}
                  <div className="hidden lg:flex items-center justify-center">
                    <div className="h-full w-px bg-gradient-to-b from-transparent via-slate-200 dark:via-white/15 to-transparent" />
                  </div>
                  {renderPlayerPanel(stats2, "right")}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
