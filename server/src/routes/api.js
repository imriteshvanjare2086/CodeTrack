import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { httpError } from "../lib/httpError.js";
import bcrypt from "bcryptjs";
import { signToken } from "../lib/jwt.js";
import { User } from "../models/User.js";
import { Problem } from "../models/Problem.js";
import { UserProblem } from "../models/UserProblem.js";
import { Friend } from "../models/Friend.js";
import { Challenge } from "../models/Challenge.js";
import { LearningTopic } from "../models/LearningTopic.js";
import { LearningSheet } from "../models/LearningSheet.js";

export const apiRouter = Router();

function toIsoDate(d) {
  return d.toISOString().slice(0, 10);
}

apiRouter.post("/auth/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) throw httpError(400, "Missing fields");

    const existing = await User.findOne({ $or: [{ email }, { username }] }).lean();
    if (existing) throw httpError(409, "User already exists");

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({ username, email, passwordHash });
    const token = signToken({ userId: String(user._id) });
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

apiRouter.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) throw httpError(400, "Missing fields");

    const user = await User.findOne({ email });
    if (!user) throw httpError(401, "Invalid credentials");

    const ok = await bcrypt.compare(String(password), String(user.passwordHash));
    if (!ok) throw httpError(401, "Invalid credentials");

    const token = signToken({ userId: String(user._id) });
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

apiRouter.get("/user/profile", requireAuth, async (req, res, next) => {
  try {
    const u = await User.findById(req.user._id).lean();
    if (!u) throw httpError(404, "User not found");
    res.json({
      user: {
        _id: String(u._id),
        username: u.username,
        email: u.email,
        platforms: u.platforms || [],
        goal: u.goal || "",
        dailyTarget: typeof u.dailyTarget === "number" ? u.dailyTarget : 3,
        streak: u.streak,
        problemsSolved: u.problemsSolved,
        platformStats: u.platformStats || { leetcode: 0, codeforces: 0, codechef: 0 },
      },
    });
  } catch (e) {
    next(e);
  }
});

apiRouter.patch("/user/profile", requireAuth, async (req, res, next) => {
  try {
    const allowed = ["streak", "problemsSolved", "platformStats", "username", "platforms", "goal", "dailyTarget"];
    const patch = {};
    for (const k of allowed) {
      if (k in (req.body || {})) patch[k] = req.body[k];
    }
    const u = await User.findByIdAndUpdate(req.user._id, patch, { new: true }).lean();
    res.json({
      user: {
        _id: String(u._id),
        username: u.username,
        email: u.email,
        platforms: u.platforms || [],
        goal: u.goal || "",
        dailyTarget: typeof u.dailyTarget === "number" ? u.dailyTarget : 3,
        streak: u.streak,
        problemsSolved: u.problemsSolved,
        platformStats: u.platformStats || { leetcode: 0, codeforces: 0, codechef: 0 },
      },
    });
  } catch (e) {
    next(e);
  }
});

apiRouter.get("/problems", requireAuth, async (req, res, next) => {
  try {
    const { platform, difficulty, topic, status } = req.query || {};

    const query = {};
    if (platform) query.platform = platform;
    if (difficulty) query.difficulty = difficulty;
    if (topic) query.tags = String(topic);

    const problems = await Problem.find(query).lean();
    if (problems.length === 0) return res.json({ problems: [] });

    const userProblems = await UserProblem.find({
      userId: req.user._id,
      problemId: { $in: problems.map((p) => p._id) },
    }).lean();
    const byProblemId = new Map(userProblems.map((up) => [String(up.problemId), up]));

    let merged = problems.map((p) => {
      const up = byProblemId.get(String(p._id));
      return {
        _id: String(p._id),
        title: p.title,
        platform: p.platform,
        difficulty: p.difficulty,
        tags: Array.isArray(p.tags) ? p.tags : [],
        url: p.url,
        status: up?.status || "unsolved",
      };
    });

    if (status) merged = merged.filter((p) => p.status === String(status));
    res.json({ problems: merged });
  } catch (e) {
    next(e);
  }
});

apiRouter.get("/friends", requireAuth, async (req, res, next) => {
  try {
    const links = await Friend.find({ userId: req.user._id }).lean();
    if (links.length === 0) return res.json({ friends: [] });
    const users = await User.find({ _id: { $in: links.map((l) => l.friendId) } }).lean();
    const map = new Map(users.map((u) => [String(u._id), u]));

    const friends = links
      .map((l) => map.get(String(l.friendId)))
      .filter(Boolean)
      .map((u) => ({
        _id: String(u._id),
        username: u.username,
        streak: u.streak,
        problemsSolved: u.problemsSolved,
        online: false,
      }));

    res.json({ friends });
  } catch (e) {
    next(e);
  }
});

apiRouter.post("/friends", requireAuth, async (req, res, next) => {
  try {
    const { friendId } = req.body || {};
    if (!friendId) throw httpError(400, "Missing friendId");
    await Friend.create({ userId: req.user._id, friendId });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

apiRouter.delete("/friends/:friendId", requireAuth, async (req, res, next) => {
  try {
    await Friend.deleteOne({ userId: req.user._id, friendId: req.params.friendId });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

apiRouter.get("/challenges", requireAuth, async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ userId: req.user._id }).lean();
    res.json({
      challenges: challenges.map((c) => ({
        _id: String(c._id),
        label: c.label,
        target: c.target,
        current: c.current,
        completed: c.completed,
      })),
    });
  } catch (e) {
    next(e);
  }
});

apiRouter.post("/challenges/:id/complete", requireAuth, async (req, res, next) => {
  try {
    await Challenge.updateOne({ _id: req.params.id, userId: req.user._id }, { $set: { completed: true } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

apiRouter.get("/learning-path", requireAuth, async (_req, res, next) => {
  try {
    const [topics, sheets] = await Promise.all([LearningTopic.find({}).lean(), LearningSheet.find({}).lean()]);
    res.json({
      topics: topics.map((t) => ({
        _id: String(t._id),
        name: t.name,
        icon: t.icon,
        difficulty: t.difficulty,
        totalProblems: t.totalProblems,
        solved: t.solved,
        subtopics: t.subtopics || [],
      })),
      sheets: sheets.map((s) => ({
        _id: String(s._id),
        name: s.name,
        description: s.description,
        totalProblems: s.totalProblems,
        solved: s.solved,
        topics: s.topics || [],
        level: s.level,
      })),
    });
  } catch (e) {
    next(e);
  }
});

apiRouter.get("/dashboard", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const ups = await UserProblem.find({ userId }).lean();
    const solvedUps = ups.filter((p) => p.status === "solved" && p.solvedAt);
    const attemptedCount = ups.filter((p) => p.status === "attempted").length;
    const solvedCount = solvedUps.length;

    const totalProblems = solvedCount + attemptedCount;

    // Contribution counts (last 365 days)
    const now = new Date();
    const byDay = new Map();
    for (const sp of solvedUps) {
      const date = toIsoDate(new Date(sp.solvedAt));
      byDay.set(date, (byDay.get(date) || 0) + 1);
    }
    const contributionData = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const date = toIsoDate(d);
      contributionData.push({ date, count: byDay.get(date) || 0 });
    }

    const solvedProblemIds = solvedUps.map((u) => u.problemId);
    const solvedProblems = solvedProblemIds.length
      ? await Problem.find({ _id: { $in: solvedProblemIds } }).lean()
      : [];

    const leetcodeSolved = solvedProblems.filter((p) => p.platform === "leetcode");
    const codeforcesSolved = solvedProblems.filter((p) => p.platform === "codeforces");
    const codechefSolved = solvedProblems.filter((p) => p.platform === "codechef");

    const leetcodeStats = {
      totalSolved: leetcodeSolved.length,
      easy: leetcodeSolved.filter((p) => p.difficulty === "easy").length,
      medium: leetcodeSolved.filter((p) => p.difficulty === "medium").length,
      hard: leetcodeSolved.filter((p) => p.difficulty === "hard").length,
      ranking: 0,
      acceptanceRate: 0,
    };

    const codeforcesStats = {
      rating: 0,
      maxRating: 0,
      rank: "Unrated",
      solved: codeforcesSolved.length,
      contests: 0,
    };

    const codechefStats = {
      stars: 0,
      rating: 0,
      solved: codechefSolved.length,
      contests: 0,
    };

    const streak = typeof req.user.streak === "number" ? req.user.streak : 0;
    const longestStreak = streak;
    const level = totalProblems >= 200 ? "Expert" : totalProblems >= 75 ? "Intermediate" : "Beginner";

    // Total contests across all platforms
    const lcContests = req.user.leetcodeStats?.contestCount || 0;
    const cfContests = req.user.codeforcesStats?.contestCount || 0;
    const ccContests = req.user.codechefStats?.contestCount || 0;
    const totalContests = lcContests + cfContests + ccContests;

    const today = toIsoDate(now);
    const todaySolved = solvedUps.filter((s) => toIsoDate(new Date(s.solvedAt)) === today).length;
    const dailyTarget = typeof req.user.dailyTarget === "number" ? req.user.dailyTarget : 3;

    res.json({
      heroStats: {
        totalProblems,
        totalContests,
        streak,
        longestStreak,
        level,
        score: totalProblems * 10,
      },
      leetcodeStats,
      codeforcesStats,
      codechefStats,
      contributionData,
      ratingHistory: { codeforces: [], leetcode: [] },
      weakTopics: [],
      recommendations: [],
      leaderboard: [],
      dailyGoal: { target: dailyTarget, completed: todaySolved, label: "Problems Today" },
      badges: [],
    });
  } catch (e) {
    next(e);
  }
});

