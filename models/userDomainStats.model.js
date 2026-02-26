import mongoose from "mongoose";

const userDomainStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
      required: true,
      index: true,
    },

    totalScore: {
      type: Number,
      default: 0,
    },

    solvedCount: {
      type: Number,
      default: 0,
    },

    difficultyBreakdown: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
    },

    lastActivityAt: Date,
  },
  { timestamps: true },
);

userDomainStatsSchema.index({ user: 1, domain: 1 }, { unique: true });

userDomainStatsSchema.index({ domain: 1, totalScore: -1 });

export default mongoose.model("UserDomainStats", userDomainStatsSchema);
