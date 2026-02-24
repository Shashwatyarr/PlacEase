// models/company.model.js

import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    logoUrl: String,

    tier: {
      type: String,
      enum: ["faang", "product", "startup", "service"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Company", companySchema);
