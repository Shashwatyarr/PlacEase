import mongoose from "mongoose";

const CATEGORY_ENUM = [
  "faang",
  "big-tech",
  "fintech",
  "quant-trading",
  "consulting-service",
  "enterprise-saas",
  "consumer-tech",
  "ecommerce-retail",
  "gaming",
  "automotive-mobility",
  "telecom-networking",
  "hardware-semiconductor",
  "health-tech",
  "media-entertainment",
  "education",
  "banking",
  "cloud-security",
  "analytics-data",
  "startup-ai",
  "startup",
];

const companySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      enum: CATEGORY_ENUM,
      required: true,
      index: true,
    },

    logoUrl: {
      type: String,
      default: null,
    },

    popularityScore: {
      type: Number,
      default: 0,
      index: true,
    },

    problemCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Optimized indexes
companySchema.index({ category: 1, popularityScore: -1 });
companySchema.index({ problemCount: -1 });

export default mongoose.model("Company", companySchema);
