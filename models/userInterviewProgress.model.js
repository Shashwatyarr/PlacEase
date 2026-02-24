// models/userInterviewProgress.model.js

import mongoose from "mongoose";

const userInterviewProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    interviewItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewItem",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["solved", "attempted", "review"],
      required: true,
      index: true,
    },

    score: {
      type: Number, // useful for MCQ
    },

    maxScore: {
      type: Number,
    },

    solvedAt: Date,
    lastAttemptedAt: Date,
  },
  { timestamps: true },
);

userInterviewProgressSchema.index(
  { userId: 1, interviewItemId: 1 },
  { unique: true },
);

userInterviewProgressSchema.index({ userId: 1, status: 1 });

export default mongoose.model(
  "UserInterviewProgress",
  userInterviewProgressSchema,
);
