import mongoose from "mongoose";

const userGlobalStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    totalScore: {
      type: Number,
      default: 0,
    },

    totalSolved: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

userGlobalStatsSchema.index({ totalScore: -1 });

export default mongoose.model("UserGlobalStats", userGlobalStatsSchema);
