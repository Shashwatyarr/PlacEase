import mongoose from "mongoose";

const dsaProblemSchema = new mongoose.Schema(
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

    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true,
      index: true,
    },

    frequencyScore: {
      type: Number,
      default: 0,
      index: true,
    },

    acceptanceRate: {
      type: Number, // store as percentage (e.g., 59)
      index: true,
    },

    tags: [
      {
        type: String,
        index: true,
      },
    ],

    companies: [
      {
        type: String, // amazon, google
        index: true,
      },
    ],

    points: {
      type: Number,
      required: true,
    },

    externalLink: {
      type: String,
      required: true,
    },

    visibility: {
      type: String,
      enum: ["public", "draft"],
      default: "public",
      index: true,
    },
  },
  { timestamps: true },
);

// Optimized compound indexes
dsaProblemSchema.index({ difficulty: 1, frequencyScore: -1 });
dsaProblemSchema.index({ companies: 1, difficulty: 1 });
dsaProblemSchema.index({ tags: 1, difficulty: 1 });

export default mongoose.model("DSAProblem", dsaProblemSchema);
