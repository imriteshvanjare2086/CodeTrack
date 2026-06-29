import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true },
  profileImage: { type: String },
  profileLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    leetcode: { type: String, default: "" },
    codeforces: { type: String, default: "" },
    codechef: { type: String, default: "" }
  },
  skills: [{ type: String }],
  platformStats: {
    leetcode: { type: Number, default: 0 },
    codeforces: { type: Number, default: 0 },
    codechef: { type: Number, default: 0 }
  },
  leetcodeUsername: { type: String, default: "" },
  codeforcesUsername: { type: String, default: "" },
  codechefUsername: { type: String, default: "" },
  leetcodeStats: {
    problemsSolved: { type: Number, default: 0 },
    contestRating: { type: Number, default: 0 },
    ranking: { type: Number, default: 0 },
    contestCount: { type: Number, default: 0 },
    badge: { type: String, default: "None" }
  },
  codeforcesStats: {
    currentRating: { type: Number, default: 0 },
    maxRating: { type: Number, default: 0 },
    rank: { type: String, default: "Not Connected" },
    contestCount: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 }
  },
  codechefStats: {
    currentRating: { type: Number, default: 0 },
    stars: { type: String, default: "0" },
    contestCount: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 }
  },
  codeforcesRatingHistory: [{
    contest: { type: String },
    rating: { type: Number }
  }],
  leetcodeRatingHistory: [{
    contest: { type: String },
    rating: { type: Number }
  }],
  codechefRatingHistory: [{
    contest: { type: String },
    rating: { type: Number }
  }],
  streak: { type: Number, default: 0 },
  problemsSolved: { type: Number, default: 0 },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema, "users");
export default User;
