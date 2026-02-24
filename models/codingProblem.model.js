import mongoose from "mongoose";
import { InterviewItem } from "./interviewItem.model.js";

const codingSchema = new mongoose.Schema({
  externalSource: {
    platform: {
      type: String,
      enum: ["leetcode", "codeforces", "codechef", "gfg", "other"],
      index: true,
    },
    platformId: String,
    link: String,
  },

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
});

export const CodingProblem = InterviewItem.discriminator(
  "coding",
  codingSchema,
);
