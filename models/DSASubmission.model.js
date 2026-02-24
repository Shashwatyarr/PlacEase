import mongoose from "mongoose";

const dsaSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DSAProblem",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["solved", "attempted"],
      required: true,
      index: true,
    },

    scoreAwarded: {
      type: Number,
      default: 0,
    },

    solvedAt: Date,
  },
  { timestamps: true },
);

// Prevent duplicate solve entries
dsaSubmissionSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export default mongoose.model("DSASubmission", dsaSubmissionSchema);
