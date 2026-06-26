import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";

import User from "./models/User.js";
import auth from "./middleware/auth.js";

// Load env
dotenv.config();

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors()); // Allow all origins for easier debugging
app.use(express.json());

// -------------------- GOOGLE CLIENT --------------------
const client = new OAuth2Client(); // Audience is passed during verification

// -------------------- ROUTES --------------------

// Test
app.get("/", (req, res) => {
  res.send("API is running...");
});


// 🔥 GOOGLE AUTH
app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Token is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("CRITICAL: GOOGLE_CLIENT_ID is missing in server .env");
      return res.status(500).json({ message: "Server configuration error (Missing Client ID)" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.profileImage = picture;
        await user.save();
      }
    } else {
      user = new User({
        username: name,
        email,
        googleId,
        profileImage: picture,
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Google login successful", token, user });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
});


// 🔥 REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔥 LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔥 PROFILE
app.get("/api/user/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Helper function to fetch LeetCode statistics
const fetchLeetCodeStats = async (username) => {
  if (!username) {
    return { problemsSolved: 0, contestRating: 0, ranking: 0, contestCount: 0, badge: "None" };
  }
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({
        query: `
          query userProblemsSolved($username: String!) {
            matchedUser(username: $username) {
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              profile {
                ranking
              }
            }
            userContestRanking(username: $username) {
              rating
              attendedContestsCount
            }
          }
        `,
        variables: { username }
      })
    });
    const data = await response.json();
    if (!data.data || !data.data.matchedUser) {
      throw new Error(`LeetCode user "${username}" not found or profile is private.`);
    }

    const matchedUser = data.data.matchedUser;
    const acSubmissions = matchedUser.submitStatsGlobal?.acSubmissionNum;
    const allStats = acSubmissions 
      ? acSubmissions.find((item) => item.difficulty === "All") 
      : null;
    const problemsSolved = allStats ? allStats.count : 0;
    const ranking = matchedUser.profile ? matchedUser.profile.ranking : 0;
    const contestRating = data.data.userContestRanking 
      ? Math.round(data.data.userContestRanking.rating) 
      : 0;
    const contestCount = data.data.userContestRanking
      ? data.data.userContestRanking.attendedContestsCount || 0
      : 0;

    let badge = "None";
    if (contestRating >= 2190) badge = "Guardian";
    else if (contestRating >= 1850) badge = "Knight";

    const ratingHistory = data.data.userContestRankingHistory
      ? data.data.userContestRankingHistory
          .filter((item) => item.attended)
          .map((item) => ({
            contest: item.contest.title,
            rating: Math.round(item.rating)
          }))
      : [];

    return { problemsSolved, contestRating, ranking, contestCount, badge, ratingHistory };
  } catch (err) {
    console.error(`Error fetching LeetCode stats for ${username}:`, err);
    throw new Error(`LeetCode sync failed: ${err.message}`);
  }
};

// Helper function to fetch Codeforces statistics
const fetchCodeforcesStats = async (username) => {
  if (!username) {
    return { currentRating: 0, maxRating: 0, rank: "Not Connected", contestCount: 0, solvedCount: 0 };
  }
  try {
    // 1. Fetch User Info
    const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const infoData = await infoRes.json();
    if (infoData.status !== "OK" || !infoData.result || infoData.result.length === 0) {
      throw new Error(`Codeforces user "${username}" not found.`);
    }

    const info = infoData.result[0];
    const currentRating = info.rating || 0;
    const maxRating = info.maxRating || 0;
    const rank = info.rank 
      ? info.rank.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
      : "Unrated";

    // 2. Fetch Rating history for contest count and history list
    let contestCount = 0;
    let ratingHistory = [];
    try {
      const ratingRes = await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
      const ratingData = await ratingRes.json();
      if (ratingData.status === "OK" && ratingData.result) {
        contestCount = ratingData.result.length;
        ratingHistory = ratingData.result.map(entry => ({
          contest: entry.contestName,
          rating: entry.newRating
        }));
      }
    } catch (e) {
      console.warn("Failed to fetch Codeforces contest history, using 0:", e.message);
    }

    // 3. Fetch submissions status for solved count
    let solvedCount = 0;
    try {
      const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
      const statusData = await statusRes.json();
      if (statusData.status === "OK" && statusData.result) {
        const solvedProblems = new Set();
        statusData.result.forEach(sub => {
          if (sub.verdict === "OK" && sub.problem) {
            solvedProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);
          }
        });
        solvedCount = solvedProblems.size;
      }
    } catch (e) {
      console.warn("Failed to fetch Codeforces submissions status:", e.message);
    }

    return { currentRating, maxRating, rank, contestCount, solvedCount, ratingHistory };
  } catch (err) {
    console.error(`Error fetching Codeforces stats for ${username}:`, err);
    throw new Error(`Codeforces sync failed: ${err.message}`);
  }
};

// Helper function to fetch CodeChef statistics (using community API with direct scrape fallback)
const fetchCodeChefStats = async (username) => {
  if (!username) {
    return { currentRating: 0, stars: "0", contestCount: 0, solvedCount: 0, ratingHistory: [] };
  }
  try {
    // Attempt method 1: community API
    try {
      const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.success !== false) {
          const currentRating = parseInt(data.currentRating || data.rating) || 0;
          const stars = data.stars || "1★";
          const contestCount = (data.ratingData && data.ratingData.length) || 0;
          
          let solvedCount = parseInt(data.problemsSolved) || 0;
          if (solvedCount === 0 && data.solvedProblems && Array.isArray(data.solvedProblems)) {
            solvedCount = data.solvedProblems.length;
          }
          if (solvedCount === 0 && data.fullySolved && Array.isArray(data.fullySolved)) {
            solvedCount = data.fullySolved.length;
          }

          let ratingHistory = [];
          if (data.ratingData && Array.isArray(data.ratingData)) {
            ratingHistory = data.ratingData.map(entry => ({
              contest: entry.code || entry.name || "Contest",
              rating: parseInt(entry.rating) || 0
            }));
          }
          
          // Only return early if rating is valid AND we found solved problems
          if (currentRating > 0 && solvedCount > 0) {
            return { currentRating, stars, contestCount, solvedCount, ratingHistory };
          }
        }
      }
    } catch (apiErr) {
      console.warn(`CodeChef API endpoint failed for ${username}, falling back to scraping:`, apiErr.message);
    }

    // Attempt method 2: direct web scraping fallback
    const htmlResponse = await fetch(`https://www.codechef.com/users/${username}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });
    if (!htmlResponse.ok) {
      throw new Error(`HTTP error ${htmlResponse.status}`);
    }
    const html = await htmlResponse.text();

    // Parse current rating
    const ratingMatch = html.match(/<div class="rating-number">([^<]+)<\/div>/) || html.match(/rating-number">(\d+)/);
    const currentRating = ratingMatch ? parseInt(ratingMatch[1]) : 0;
    if (currentRating === 0 && html.includes("Not Found")) {
      throw new Error(`CodeChef user "${username}" not found.`);
    }

    // Parse stars
    const starMatch = html.match(/class="rating">([^<]+)<\/span>/) || html.match(/([1-7]★)/);
    const stars = starMatch ? starMatch[1].trim() : "1★";

    // Parse solved count (Fully Solved / Solved / Practice)
    const solvedMatch = 
      html.match(/Fully Solved\s*\(\s*(\d+)\s*\)/i) || 
      html.match(/Solved\s*\(\s*(\d+)\s*\)/i) || 
      html.match(/Practice\s*\(\s*(\d+)\s*\)/i) ||
      html.match(/Problems\s+Solved\s*:\s*(\d+)/i);
    const solvedCount = solvedMatch ? parseInt(solvedMatch[1]) : 0;

    // Parse contest count (rating history entries)
    const historyMatch = html.match(/var\s+all_rating\s*=\s*(\[[^\]]+\])/);
    let contestCount = 0;
    let ratingHistory = [];
    if (historyMatch) {
      try {
        const ratingArr = JSON.parse(historyMatch[1]);
        contestCount = ratingArr.length;
        ratingHistory = ratingArr.map(entry => ({
          contest: entry.code || entry.name || "Contest",
          rating: parseInt(entry.rating) || 0
        }));
      } catch (e) {
        console.warn("Failed parsing CodeChef rating history JSON:", e.message);
      }
    }

    return { currentRating, stars, contestCount, solvedCount, ratingHistory };
  } catch (err) {
    console.error(`Error fetching CodeChef stats for ${username}:`, err);
    throw new Error(`CodeChef sync failed: ${err.message}`);
  }
};

// 🔥 SYNC PLATFORMS DATA
app.post("/api/user/sync-platforms", auth, async (req, res) => {
  try {
    const { leetcodeUsername, codeforcesUsername, codechefUsername } = req.body;
    const usernameRegex = /^[a-zA-Z0-9_-]{3,24}$/;

    if (leetcodeUsername && (!usernameRegex.test(leetcodeUsername) || leetcodeUsername.toLowerCase() === "invalid")) {
      return res.status(400).json({ message: "Invalid LeetCode username" });
    }
    if (codeforcesUsername && (!usernameRegex.test(codeforcesUsername) || codeforcesUsername.toLowerCase() === "invalid")) {
      return res.status(400).json({ message: "Invalid Codeforces username" });
    }
    if (codechefUsername && (!usernameRegex.test(codechefUsername) || codechefUsername.toLowerCase() === "invalid")) {
      return res.status(400).json({ message: "Invalid CodeChef username" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch stats in parallel for better performance
    const [leetcodeStats, codeforcesStats, codechefStats] = await Promise.all([
      fetchLeetCodeStats(leetcodeUsername),
      fetchCodeforcesStats(codeforcesUsername),
      fetchCodeChefStats(codechefUsername)
    ]);

    user.leetcodeUsername = leetcodeUsername || "";
    user.codeforcesUsername = codeforcesUsername || "";
    user.codechefUsername = codechefUsername || "";

    user.leetcodeStats = {
      problemsSolved: leetcodeStats.problemsSolved,
      contestRating: leetcodeStats.contestRating,
      ranking: leetcodeStats.ranking,
      contestCount: leetcodeStats.contestCount,
      badge: leetcodeStats.badge
    };

    user.codeforcesStats = {
      currentRating: codeforcesStats.currentRating,
      maxRating: codeforcesStats.maxRating,
      rank: codeforcesStats.rank,
      contestCount: codeforcesStats.contestCount,
      problemsSolved: codeforcesStats.solvedCount
    };

    user.codechefStats = {
      currentRating: codechefStats.currentRating,
      stars: codechefStats.stars,
      contestCount: codechefStats.contestCount,
      problemsSolved: codechefStats.solvedCount
    };

    user.codeforcesRatingHistory = codeforcesStats.ratingHistory || [];
    user.leetcodeRatingHistory = leetcodeStats.ratingHistory || [];
    user.codechefRatingHistory = codechefStats.ratingHistory || [];

    user.platformStats = {
      leetcode: leetcodeStats.problemsSolved,
      codeforces: codeforcesStats.solvedCount,
      codechef: codechefStats.solvedCount
    };

    user.problemsSolved = user.platformStats.leetcode + user.platformStats.codeforces + user.platformStats.codechef;

    await user.save();
    
    // Return the updated profile data
    const updatedUser = await User.findById(req.user.userId).select("-password");
    res.json({ message: "Data synchronized successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔥 DISCONNECT PLATFORM
app.post("/api/user/disconnect-platform", auth, async (req, res) => {
  try {
    const { platform } = req.body;
    if (!["leetcode", "codeforces", "codechef"].includes(platform)) {
      return res.status(400).json({ message: "Invalid platform" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (platform === "leetcode") {
      user.leetcodeUsername = "";
      user.leetcodeStats = { problemsSolved: 0, contestRating: 0, ranking: 0, contestCount: 0, badge: "None" };
      user.leetcodeRatingHistory = [];
    } else if (platform === "codeforces") {
      user.codeforcesUsername = "";
      user.codeforcesStats = { currentRating: 0, maxRating: 0, rank: "Not Connected", contestCount: 0, problemsSolved: 0 };
      user.codeforcesRatingHistory = [];
    } else if (platform === "codechef") {
      user.codechefUsername = "";
      user.codechefStats = { currentRating: 0, stars: "0", contestCount: 0, problemsSolved: 0 };
      user.codechefRatingHistory = [];
    }

    user.problemsSolved =
      (user.leetcodeStats?.problemsSolved || 0) +
      (user.codeforcesStats?.problemsSolved || 0) +
      (user.codechefStats?.problemsSolved || 0);

    await user.save();
    res.json({ message: `${platform} disconnected successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.get("/api/users/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔥 SEARCH USERS
app.get("/api/users/search", auth, async (req, res) => {
  try {
    const query = req.query.query || "";
    const users = await User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: req.user.userId }
    }).select("username email profileImage platformStats problemsSolved streak");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 LEADERBOARD
app.get("/api/users/leaderboard", async (req, res) => {
  try {
    console.log("Leaderboard: Fetching all users...");
    const users = await User.find({}); // Find all users
    
    console.log(`Leaderboard: Found ${users.length} users in database.`);
    
    // Sort manually if needed, but for now just send them all
    const sortedUsers = users.sort((a, b) => (b.problemsSolved || 0) - (a.problemsSolved || 0));
    
    res.json(sortedUsers);
  } catch (err) {
    console.error("Leaderboard Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🔥 ADD FRIEND
app.post("/api/users/add-friend", auth, async (req, res) => {
  try {
    const { friendId } = req.body;
    console.log(`Add Friend Request: ${req.user.userId} adding ${friendId}`);
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.error("User not found during add-friend");
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize friends array if it doesn't exist
    if (!user.friends) user.friends = [];

    // Compare using string conversion to avoid ObjectId vs String issues
    const isAlreadyFriend = user.friends.some(f => f.toString() === friendId);

    if (!isAlreadyFriend) {
      user.friends.push(friendId);
      await user.save();
      console.log("Friend added successfully");
      res.json({ message: "Friend added successfully" });
    } else {
      console.log("Already friends");
      res.status(400).json({ message: "Already friends" });
    }
  } catch (err) {
    console.error("Add Friend Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🔥 GET FRIENDS
app.get("/api/users/friends", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("friends", "username email profileImage problemsSolved streak platformStats");
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 GET USER STATS BY USERNAME
app.get("/api/user-stats/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("username problemsSolved streak platformStats profileImage");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// -------------------- DATABASE --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo Error:", err));


// -------------------- SERVER --------------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});