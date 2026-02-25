import mongoose from "mongoose";

const dsaProblemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
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
      type: Number,
      default: null,
    },

    tags: [
      {
        type: String,
      },
    ],

    companies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
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

dsaProblemSchema.index({ difficulty: 1, frequencyScore: -1 });
dsaProblemSchema.index({ companies: 1 });
dsaProblemSchema.index({ tags: 1 });
dsaProblemSchema.index({ companies: 1, difficulty: 1 });
dsaProblemSchema.index({ title: "text" });

export default mongoose.model("DSAProblem", dsaProblemSchema);
