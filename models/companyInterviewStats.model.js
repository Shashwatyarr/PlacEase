import mongoose from "mongoose";

const companyInterviewStatsSchema = new mongoose.Schema(
  {
    companySlug: {
      type: String,
      required: true,
      index: true,
    },

    interviewItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewItem",
      required: true,
      index: true,
    },

    role: {
      type: String,
      index: true,
    },

    round: {
      type: String,
      enum: ["OA", "Tech1", "Tech2", "HR"],
      index: true,
    },

    frequency: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

companyInterviewStatsSchema.index(
  { companySlug: 1, interviewItemId: 1, role: 1, round: 1 },
  { unique: true },
);

export default mongoose.model(
  "CompanyInterviewStats",
  companyInterviewStatsSchema,
);
