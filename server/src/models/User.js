import mongoose from "mongoose";

const PlatformSchema = new mongoose.Schema(
  {
    id: { type: String, enum: ["leetcode", "codeforces", "codechef"], required: true },
    username: { type: String, default: "" },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    platforms: { type: [PlatformSchema], default: [] },
    profileLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      leetcode: { type: String, default: "" },
      codeforces: { type: String, default: "" },
      codechef: { type: String, default: "" },
    },
    skills: { type: [String], default: [] },
    goal: { type: String, default: "" },
    dailyTarget: { type: Number, default: 3 },
    streak: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 },
    platformStats: {
      leetcode: { type: Number, default: 0 },
      codeforces: { type: Number, default: 0 },
      codechef: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);

