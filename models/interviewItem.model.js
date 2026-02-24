import mongoose from "mongoose";

const baseInterviewItemSchema = new mongoose.Schema(
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

    category: {
      type: String,
      enum: [
        "dsa",
        "os",
        "cn",
        "dbms",
        "oops",
        "system-design",
        "hr",
        "ml",
        "cloud",
      ],
      required: true,
      index: true,
    },
    collections: [
      {
        type: String,
        index: true,
      },
    ],
    format: {
      type: String,
      enum: ["coding", "mcq", "short-answer", "case-study"],
      required: true,
      index: true,
    },

    subCategory: {
      type: String,
      index: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
      index: true,
    },

    tags: [
      {
        type: String,
        index: true,
      },
    ],

    estimatedTimeMinutes: {
      type: Number,
    },

    isPremium: {
      type: Boolean,
      default: false,
      index: true,
    },

    visibility: {
      type: String,
      enum: ["public", "draft", "archived"],
      default: "public",
      index: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "format",
  },
);

baseInterviewItemSchema.index({ category: 1, difficulty: 1 });
baseInterviewItemSchema.index({ category: 1, tags: 1 });
baseInterviewItemSchema.index({ title: "text" });

export const InterviewItem = mongoose.model(
  "InterviewItem",
  baseInterviewItemSchema,
);
