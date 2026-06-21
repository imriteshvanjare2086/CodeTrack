import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true },
  profileImage: { type: String },
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
    ranking: { type: Number, default: 0 }
  },
  codeforcesStats: {
    currentRating: { type: Number, default: 0 },
    maxRating: { type: Number, default: 0 },
    rank: { type: String, default: "Not Connected" },
    contestCount: { type: Number, default: 0 }
  },
  codechefStats: {
    currentRating: { type: Number, default: 0 },
    stars: { type: String, default: "0" },
    contestCount: { type: Number, default: 0 }
  },
  streak: { type: Number, default: 0 },
  problemsSolved: { type: Number, default: 0 },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema, "users");
export default User;