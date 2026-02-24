import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ["leetcode", "codeforces", "codechef", "gfg", "other"],
      required: true,
      index: true,
    },
    platformId: {
      type: String,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
      index: true,
    },
    topics: [
      {
        type: String,
        index: true,
      },
    ],
    constraints: {
      type: String,
    },
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    stats: {
      totalSubmissions: Number,
      totalAccepted: Number,
      acceptanceRate: Number,
    },
    externalLink: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

problemSchema.index({ topics: 1, difficulty: 1 });
problemSchema.index({ title: "text" });

export default mongoose.model("Problem", problemSchema);
