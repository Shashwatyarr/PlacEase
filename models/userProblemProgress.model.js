import mongoose from "mongoose";
import { probeAsync } from "three/src/utils.js";
import { IndirectStorageBufferAttribute } from "three/webgpu";

const userProblemProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DSAProblem",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["SOLVED", "ATTEMPTED", "REVIEW"],
      required: true,
      index: true,
    },
    scoreEarned: {
      type: Number,
      defualt: 0,
    },
    difficultyAtSolve: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
    },
    solvedAt: {
      type: Date,
    },
    attempCount: {
      type: Number,
      default: 0,
    },
    companiesSnapshot: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        index: true,
      },
    ],
  },
  { timestamps: true },
);

userProblemProgressSchema.index({ user: 1, problem: 1 }, { unique: true });
userProblemProgressSchema.index({ user: 1, companiesSnapshot: 1 });

export default mongoose.model("UserProblemProgress", userProblemProgressSchema);
